function setup() {
  var props = PropertiesService.getScriptProperties();

  if (!props.getProperty('PERMISSION_SHEET_ID')) {
    var ss = SpreadsheetApp.create('入口網站權限表');

    var permSheet = ss.getActiveSheet();
    permSheet.setName('permissions');
    permSheet.appendRow(['代碼', '姓名', '物管系統', '會議室預約', '補課查看', '遊覽車']);

    var logSheet = ss.insertSheet('logins');
    logSheet.appendRow(['時間', '代碼', '姓名']);

    props.setProperty('PERMISSION_SHEET_ID', ss.getId());
    Logger.log('權限表已建立：' + ss.getUrl());
  } else {
    Logger.log('權限表已存在，略過建立。');
  }

  Logger.log('接下來請到「專案設定」→「指令碼屬性」手動新增以下屬性：');
  Logger.log('ADMIN_CODES＝可管理權限表的代碼，逗號分隔');
  Logger.log('LINK_物管系統、LINK_會議室預約、LINK_補課查看、LINK_遊覽車＝各系統的實際連結網址');
}

function useExistingPermissionSheet() {
  var sheetId = '1C9FVElBDIZUlbAa5_y3GyBP2dx6HPyUTNtawY-QPPuE';
  var ss = SpreadsheetApp.openById(sheetId);

  var permSheet = ss.getSheetByName('permissions');
  if (!permSheet) {
    var sheets = ss.getSheets();
    if (sheets.length === 1 && sheets[0].getLastRow() === 0) {
      permSheet = sheets[0];
      permSheet.setName('permissions');
    } else {
      permSheet = ss.insertSheet('permissions');
    }
  }
  if (permSheet.getLastRow() === 0) {
    permSheet.appendRow(['代碼', '姓名', '物管系統', '會議室預約', '補課查看', '遊覽車']);
  }

  var logSheet = ss.getSheetByName('logins');
  if (!logSheet) {
    logSheet = ss.insertSheet('logins');
  }
  if (logSheet.getLastRow() === 0) {
    logSheet.appendRow(['時間', '代碼', '姓名']);
  }

  PropertiesService.getScriptProperties().setProperty('PERMISSION_SHEET_ID', sheetId);
  Logger.log('已改用指定的 Sheet：' + ss.getUrl());
}
