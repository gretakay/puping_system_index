function verifyIdToken(idToken) {
  if (!idToken) throw new Error('缺少 idToken');

  var res = UrlFetchApp.fetch(
    'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken),
    { muteHttpExceptions: true }
  );

  if (res.getResponseCode() !== 200) {
    throw new Error('Token 驗證失敗');
  }

  var payload = JSON.parse(res.getContentText());
  var clientId = PropertiesService.getScriptProperties().getProperty('OAUTH_CLIENT_ID');

  if (!clientId) throw new Error('尚未設定 Script Property：OAUTH_CLIENT_ID');
  if (payload.aud !== clientId) throw new Error('Token 對象（aud）不符');
  if (payload.email_verified !== 'true' && payload.email_verified !== true) {
    throw new Error('Email 尚未驗證');
  }

  return payload.email;
}

function requireAdmin(email) {
  var raw = PropertiesService.getScriptProperties().getProperty('ADMIN_EMAILS') || '';
  var admins = raw.split(',').map(function (s) { return s.trim(); });

  if (admins.indexOf(email) === -1) {
    throw new Error('沒有管理權限：' + email);
  }
}
