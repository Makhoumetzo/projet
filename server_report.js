/**
 * Node "Code": build Telegram alert message for critical servers.
 */
function buildCriticalMessage(items) {
  const cleanedItems = items;
  const critical = cleanedItems.filter(
    i => ((i.json.Etat ?? '').trim().toUpperCase() === 'CRIT')
  );

  if (critical.length === 0) {
    return [];
  }

  function getServerName(json) {
    return (
      json.Nom_du_Serveur ||
      json['﻿Nom_du_Serveur'] ||
      json[' Nom_du_Serveur'] ||
      '<nom inconnu>'
    ).toString().trim();
  }

  let msg = '⚠️ *Alerte serveur critique détectée!* ⚠️\n\n';
  critical.forEach((item, idx) => {
    const j = item.json;
    const server = getServerName(j);
    const cpu = (j.CPU_Pct ?? '').trim();
    const ram = (j.RAM_Mo ?? '').trim();
    const etat = (j.Etat ?? '').trim();
    const timestamp = (j.Timestamp ?? '').trim();
    msg += `*${idx + 1}.* 🔷 *Serveur* : ${server}\n`;
    msg += `   🧠 *CPU* : ${cpu} %\n`;
    msg += `   💾 *RAM* : ${ram} Mo\n`;
    msg += `   📊 *État* : ${etat}\n`;
    msg += `   🕒 *Horodatage* : ${timestamp}\n\n`;
  });

  return [{ json: { message: msg.trim() } }];
}

/**
 * Node "Prépare Excel": prepare lists grouped by alert level.
 */
function prepareExcel(items) {
  const cleaned = items.map(i => i.json);

  const critiques = cleaned.filter(
    s => ((s.Etat ?? '').trim().toUpperCase() === 'CRIT')
  );
  const warnings = cleaned.filter(
    s => ((s.Etat ?? '').trim().toUpperCase() === 'WARN')
  );
  const normaux = cleaned.filter(
    s => ((s.Etat ?? '').trim().toUpperCase() === 'OK')
  );

  const resume = [
    { Etat: 'CRITIQUE', Total: critiques.length },
    { Etat: 'WARNING', Total: warnings.length },
    { Etat: 'NORMAL', Total: normaux.length },
  ];

  return [{ json: { resume, critiques, warnings, normaux } }];
}

module.exports = { buildCriticalMessage, prepareExcel };
