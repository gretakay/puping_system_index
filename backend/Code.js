function doGet(e) {
  return jsonResponse({ ok: true, message: '入口網站後端 API 運作中' });
}

function doPost(e) {
  try {
    var params = JSON.parse(e.postData.contents);
    return handleAction(params);
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function handleAction(params) {
  var action = params.action;

  if (action === 'login') {
    var row = validateCode(params.code);
    logLogin(params.code, row['姓名']);
    return jsonResponse({ ok: true, name: row['姓名'], links: getLinksForRow(row) });
  }

  if (action === 'getPermissions') {
    requireAdminCode(params.code);
    return jsonResponse({ ok: true, permissions: getAllPermissions() });
  }

  if (action === 'setPermission') {
    requireAdminCode(params.code);
    setPermission(params.targetCode, params.name, params.systems);
    return jsonResponse({ ok: true });
  }

  if (action === 'removeUser') {
    requireAdminCode(params.code);
    removeUser(params.targetCode);
    return jsonResponse({ ok: true });
  }

  return jsonResponse({ ok: false, error: '未知的 action：' + action });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
