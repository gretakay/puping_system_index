var SYSTEMS = ['物管系統', '會議室預約', '補課查看', '遊覽車'];

function getSystemLink(systemName) {
  var link = PropertiesService.getScriptProperties().getProperty('LINK_' + systemName);
  if (!link) throw new Error('尚未設定 Script Property：LINK_' + systemName);
  return link;
}

function getPermissionSheet() {
  var sheetId = PropertiesService.getScriptProperties().getProperty('PERMISSION_SHEET_ID');
  if (!sheetId) throw new Error('尚未設定 Script Property：PERMISSION_SHEET_ID，請先執行 setup()');
  return SpreadsheetApp.openById(sheetId).getSheetByName('permissions');
}

function getLoginLogSheet() {
  var sheetId = PropertiesService.getScriptProperties().getProperty('PERMISSION_SHEET_ID');
  return SpreadsheetApp.openById(sheetId).getSheetByName('logins');
}

function getAllPermissions() {
  var sheet = getPermissionSheet();
  var values = sheet.getDataRange().getValues();
  var headers = values[0];

  return values.slice(1).map(function (row) {
    var obj = {};
    headers.forEach(function (h, i) { obj[h] = row[i]; });
    return obj;
  });
}

function getLinksForRow(row) {
  return SYSTEMS
    .filter(function (sys) { return row[sys] === true; })
    .map(function (sys) { return { name: sys, url: getSystemLink(sys) }; });
}

function setPermission(code, name, systemFlags) {
  var sheet = getPermissionSheet();
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var codeCol = headers.indexOf('代碼');

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][codeCol]) === String(code)) {
      var rowIndex = i + 1;
      sheet.getRange(rowIndex, headers.indexOf('姓名') + 1).setValue(name);
      SYSTEMS.forEach(function (sys) {
        var col = headers.indexOf(sys) + 1;
        sheet.getRange(rowIndex, col).setValue(!!(systemFlags && systemFlags[sys]));
      });
      return;
    }
  }

  var newRow = headers.map(function (h) {
    if (h === '代碼') return code;
    if (h === '姓名') return name;
    if (SYSTEMS.indexOf(h) !== -1) return !!(systemFlags && systemFlags[h]);
    return false;
  });
  sheet.appendRow(newRow);
}

function removeUser(code) {
  var sheet = getPermissionSheet();
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var codeCol = headers.indexOf('代碼');

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][codeCol]) === String(code)) {
      sheet.deleteRow(i + 1);
      return;
    }
  }
}

function logLogin(code, name) {
  getLoginLogSheet().appendRow([new Date(), code, name]);
}
