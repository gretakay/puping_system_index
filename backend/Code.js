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

  if (action === 'getLinks') {
    var email = verifyIdToken(params.idToken);
    return jsonResponse({ ok: true, links: getLinksForUser(email) });
  }

  if (action === 'getPermissions') {
    var adminEmail = verifyIdToken(params.idToken);
    requireAdmin(adminEmail);
    return jsonResponse({ ok: true, permissions: getAllPermissions() });
  }

  if (action === 'setPermission') {
    var adminEmail2 = verifyIdToken(params.idToken);
    requireAdmin(adminEmail2);
    setPermission(params.targetEmail, params.name, params.systems);
    return jsonResponse({ ok: true });
  }

  if (action === 'removeUser') {
    var adminEmail3 = verifyIdToken(params.idToken);
    requireAdmin(adminEmail3);
    removeUser(params.targetEmail);
    return jsonResponse({ ok: true });
  }

  return jsonResponse({ ok: false, error: '未知的 action：' + action });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
