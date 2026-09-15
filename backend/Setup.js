function setup() {
  var props = PropertiesService.getScriptProperties();

  if (!props.getProperty('PERMISSION_SHEET_ID')) {
    var ss = SpreadsheetApp.create('入口網站權限表');
    var sheet = ss.getActiveSheet();
    sheet.setName('permissions');
    sheet.appendRow(['Email', '姓名', '物管系統', '會議室預約', '補課查看', '遊覽車']);
    props.setProperty('PERMISSION_SHEET_ID', ss.getId());
    Logger.log('權限表已建立：' + ss.getUrl());
  } else {
    Logger.log('權限表已存在，略過建立。');
  }

  Logger.log('接下來請到「專案設定」→「指令碼屬性」手動新增以下屬性：');
  Logger.log('OAUTH_CLIENT_ID＝Google Cloud Console 建立的 OAuth Client ID');
  Logger.log('ADMIN_EMAILS＝可管理權限表的 Email，逗號分隔');
  Logger.log('LINK_物管系統、LINK_會議室預約、LINK_補課查看、LINK_遊覽車＝各系統的實際連結網址');
}
