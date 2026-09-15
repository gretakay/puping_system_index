function validateCode(code) {
  if (!code) throw new Error('請輸入代碼');

  var rows = getAllPermissions();
  var row = rows.filter(function (r) { return String(r['代碼']) === String(code); })[0];

  if (!row) throw new Error('代碼錯誤');

  return row;
}

function requireAdminCode(code) {
  var raw = PropertiesService.getScriptProperties().getProperty('ADMIN_CODES') || '';
  var admins = raw.split(',').map(function (s) { return s.trim(); });

  if (admins.indexOf(String(code)) === -1) {
    throw new Error('沒有管理權限');
  }
}
