using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Syncfusion.Collaboration.Core.Interfaces;
using Syncfusion.Collaboration.Core.Models;
using Syncfusion.Collaboration.Core.Services;
using Syncfusion.Collaboration.Core.Transports;
using Syncfusion.EJ2.Spreadsheet;
using Syncfusion.XlsIO;

namespace EJ2SpreadsheetServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CollaborativeEditingController : ControllerBase
    {
        private static readonly ConcurrentDictionary<
            string,
            ConcurrentDictionary<string, SpreadsheetSelectionInfo>>
            RoomSelections =
                new ConcurrentDictionary<
                    string,
                    ConcurrentDictionary<
                        string,
                        SpreadsheetSelectionInfo>>();

        private readonly IWebHostEnvironment hostingEnvironment;
        private readonly IActionService actionService;
        private readonly ICollaborationAdapter adapter;
        private readonly IActiveTransport transport;

        private static readonly JsonSerializerSettings
            ControllerJsonSettings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy()
                }
            };

        public CollaborativeEditingController(
            IWebHostEnvironment hostingEnvironment,
            IActionService actionService,
            ICollaborationAdapter adapter,
            IActiveTransport transport)
        {
            this.hostingEnvironment = hostingEnvironment;
            this.actionService = actionService;
            this.adapter = adapter;
            this.transport = transport;
        }

        [HttpPost]
        [Route("ImportFile")]
        [EnableCors("AllowAllOrigins")]
        public async Task<string> ImportFile(
            [FromBody] FileInfo param)
        {
            if (param == null ||
                string.IsNullOrWhiteSpace(param.roomName))
            {
                return null;
            }

            string filePath = Path.Combine(
                hostingEnvironment.WebRootPath,
                "Files",
                "Sample.xlsx"
            );

            if (!System.IO.File.Exists(filePath))
            {
                return null;
            }

            try
            {
                List<CollaborationAction> collaborationActions =
                    await actionService.GetPendingOperationsAsync(
                        param.roomName,
                        0,
                        -1
                    );

                List<ActionInfo> spreadsheetActions =
                    collaborationActions == null
                        ? new List<ActionInfo>()
                        : collaborationActions
                            .Select(action =>
                                adapter.MapGenericToControlAction(
                                    action
                                ) as ActionInfo
                            )
                            .Where(action => action != null)
                            .OrderBy(action => action.Version)
                            .ToList();

                using (ExcelEngine temporaryExcelEngine =
                    new ExcelEngine())
                {
                    IApplication application =
                        temporaryExcelEngine.Excel;

                    IWorkbook temporaryWorkbook =
                        application.Workbooks.Open(filePath);

                    try
                    {
                        if (spreadsheetActions.Count > 0)
                        {
                            CollaborativeEditingHandler handler =
                                new CollaborativeEditingHandler(
                                    temporaryWorkbook
                                );

                            foreach (ActionInfo action in
                                spreadsheetActions)
                            {
                                handler.UpdateAction(action);
                            }
                        }

                        using (MemoryStream workbookStream =
                            new MemoryStream())
                        {
                            temporaryWorkbook.SaveAs(
                                workbookStream
                            );

                            workbookStream.Position = 0;

                            string clientFileName =
                                string.IsNullOrWhiteSpace(
                                    param.fileName
                                )
                                    ? "Sample"
                                    : param.fileName;

                            IFormFile formFile = new FormFile(
                                workbookStream,
                                0,
                                workbookStream.Length,
                                clientFileName,
                                "Sample.xlsx"
                            );

                            OpenRequest openRequest =
                                new OpenRequest
                                {
                                    File = formFile
                                };

                            string workbookJson =
                                Workbook.Open(openRequest);

                            int currentVersion =
                                spreadsheetActions.Count > 0
                                    ? spreadsheetActions.Max(
                                        action => action.Version
                                    )
                                    : 0;

                            DocumentContent content =
                                new DocumentContent
                                {
                                    sfdt = workbookJson,
                                    version = currentVersion
                                };

                            return JsonConvert.SerializeObject(
                                content
                            );
                        }
                    }
                    finally
                    {
                        temporaryWorkbook.Close();
                    }
                }
            }
            catch (Exception exception)
            {
                Console.WriteLine(
                    "Spreadsheet import failed: " +
                    exception
                );

                return null;
            }
        }

        [HttpPost]
        [Route("UpdateAction")]
        [EnableCors("AllowAllOrigins")]
        public async Task<string> UpdateAction(
            [FromBody] ActionInfo param)
        {
            if (param == null ||
                string.IsNullOrWhiteSpace(param.RoomName))
            {
                return null;
            }

            CollaborationAction collaborationAction =
                adapter.MapControlToGenericAction(param);

            CollaborationAction modifiedAction =
                await actionService.AddOperationAsync(
                    collaborationAction,
                    adapter
                );

            ActionInfo updatedAction =
                modifiedAction == null
                    ? null
                    : adapter.MapGenericToControlAction(
                        modifiedAction
                    ) as ActionInfo;

            if (updatedAction == null)
            {
                return null;
            }

            string payload = JsonConvert.SerializeObject(
                updatedAction,
                ControllerJsonSettings
            );

            await transport.SendToGroupAsync(
                param.RoomName,
                "action",
                payload
            );

            return payload;
        }

        [HttpPost]
        [Route("UpdateSelection")]
        [EnableCors("AllowAllOrigins")]
        public async Task<SpreadsheetSelectionInfo>
            UpdateSelection(
                [FromBody] SpreadsheetSelectionInfo param)
        {
            if (param == null ||
                string.IsNullOrWhiteSpace(param.RoomName) ||
                string.IsNullOrWhiteSpace(param.ConnectionId))
            {
                return param;
            }

            ConcurrentDictionary<
                string,
                SpreadsheetSelectionInfo> selections =
                    RoomSelections.GetOrAdd(
                        param.RoomName,
                        _ => new ConcurrentDictionary<
                            string,
                            SpreadsheetSelectionInfo>()
                    );

            selections.AddOrUpdate(
                param.ConnectionId,
                param,
                (_, _) => param
            );

            await transport.SendToGroupExceptAsync(
                param.RoomName,
                param.ConnectionId,
                "action",
                param
            );

            return param;
        }

        [HttpGet]
        [Route("GetRoomSelections/{roomName}")]
        [EnableCors("AllowAllOrigins")]
        public ActionResult<List<SpreadsheetSelectionInfo>>
            GetRoomSelections(string roomName)
        {
            if (string.IsNullOrWhiteSpace(roomName) ||
                !RoomSelections.TryGetValue(
                    roomName,
                    out ConcurrentDictionary<
                        string,
                        SpreadsheetSelectionInfo> selections
                ))
            {
                return Ok(
                    new List<SpreadsheetSelectionInfo>()
                );
            }

            return Ok(selections.Values.ToList());
        }

        [HttpPost]
        [Route("RemoveUserSelection")]
        [EnableCors("AllowAllOrigins")]
        public ActionResult RemoveUserSelection(
            [FromBody] RemoveSelectionRequest request)
        {
            if (request == null ||
                string.IsNullOrWhiteSpace(
                    request.RoomName
                ) ||
                string.IsNullOrWhiteSpace(
                    request.ConnectionId
                ))
            {
                return Ok();
            }

            if (RoomSelections.TryGetValue(
                request.RoomName,
                out ConcurrentDictionary<
                    string,
                    SpreadsheetSelectionInfo> selections
            ))
            {
                selections.TryRemove(
                    request.ConnectionId,
                    out _
                );

                if (selections.IsEmpty)
                {
                    RoomSelections.TryRemove(
                        request.RoomName,
                        out _
                    );
                }
            }

            return Ok();
        }

        [HttpPost]
        [Route("GetActionsFromServer")]
        [EnableCors("AllowAllOrigins")]
        public async Task<ActionResult<List<ActionInfo>>>
            GetActionsFromServer(
                [FromBody] ActionInfo param)
        {
            if (param == null ||
                string.IsNullOrWhiteSpace(param.RoomName))
            {
                return Ok(new List<ActionInfo>());
            }

            int lastSyncedVersion = param.Version;

            List<CollaborationAction> collaborationActions =
                await actionService
                    .GetEffectivePendingVersionAsync(
                        param.RoomName,
                        lastSyncedVersion
                    );

            List<ActionInfo> actions =
                collaborationActions == null
                    ? new List<ActionInfo>()
                    : collaborationActions
                        .Select(action =>
                            adapter.MapGenericToControlAction(
                                action
                            ) as ActionInfo
                        )
                        .Where(action =>
                            action != null &&
                            action.Version >
                                lastSyncedVersion
                        )
                        .OrderBy(action => action.Version)
                        .ToList();

            string payload = JsonConvert.SerializeObject(
                actions,
                ControllerJsonSettings
            );

            return Ok(payload);
        }

        public class RemoveSelectionRequest
        {
            public string RoomName { get; set; }

            public string ConnectionId { get; set; }
        }

        public class DocumentContent
        {
            public int version { get; set; }

            public string sfdt { get; set; }
        }

        public class FileInfo
        {
            public string fileName { get; set; }

            public string roomName { get; set; }
        }
    }
}
