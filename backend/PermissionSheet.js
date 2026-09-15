var SYSTEMS = ['物管系統', '會議室預約', '補課查看', '遊覽車'];

function getSystemLink(systemName) {
  var link = PropertiesService.getScriptProperties().getProperty('LINK_' + systemName);
  if (!link) throw new Error('尚未設定 Script Property：LINK_' + systemName);
  return link;
}

function getSheet() {
  var sheetId = PropertiesService.getScriptProperties().getProperty('PERMISSION_SHEET_ID');
  if (!sheetId) throw new Error('尚未設定 Script Property：PERMISSION_SHEET_ID，請先執行 setup()');
  return SpreadsheetApp.openById(sheetId).getSheetByName('permissions');
}

function getAllPermissions() {
  var sheet = getSheet();
  var values = sheet.getDataRange().getValues();
  var headers = values[0];

  return values.slice(1).map(function (row) {
    var obj = {};
    headers.forEach(function (h, i) { obj[h] = row[i]; });
    return obj;
  });
}

function getLinksForUser(email) {
  var rows = getAllPermissions();
  var row = rows.filter(function (r) { return r['Email'] === email; })[0];
  if (!row) return [];

  return SYSTEMS
    .filter(function (sys) { return row[sys] === true; })
    .map(function (sys) { return { name: sys, url: getSystemLink(sys) }; });
}

function setPermission(email, name, systemFlags) {
  var sheet = getSheet();
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var emailCol = headers.indexOf('Email');

  for (var i = 1; i < values.length; i++) {
    if (values[i][emailCol] === email) {
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
    if (h === 'Email') return email;
    if (h === '姓名') return name;
    if (SYSTEMS.indexOf(h) !== -1) return !!(systemFlags && systemFlags[h]);
    return false;
  });
  sheet.appendRow(newRow);
}

function removeUser(email) {
  var sheet = getSheet();
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var emailCol = headers.indexOf('Email');

  for (var i = 1; i < values.length; i++) {
    if (values[i][emailCol] === email) {
      sheet.deleteRow(i + 1);
      return;
    }
  }
}
