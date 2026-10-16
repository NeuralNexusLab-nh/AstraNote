"use strict";
// Fail closed: this is a reviewed educational namespace allowlist, not an
// arbitrary edu.<two letters> regex. Matching requires an institution label
// before the namespace, so edu.tw.attacker.example cannot receive privileges.
// Sources and review process are recorded in docs/education-domains.md.
const SUFFIXES = Object.freeze(["edu", "edu.tw", "edu.au", "edu.hk", "edu.sg", "edu.my", "edu.vn", "edu.cn", "edu.ph", "edu.tr"]);
function matchesEmail(email) {
  if (typeof email !== "string") return false;
  const parts = email.toLowerCase().split("@");
  if (parts.length !== 2 || !parts[0]) return false;
  const domain = parts[1];
  if (domain.length > 253 || !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain)) return false;
  return SUFFIXES.some(suffix => domain.endsWith(`.${suffix}`));
}
const eligible = metadata => metadata?.emailVerified === true && matchesEmail(metadata.email);
module.exports = { eligible, matchesEmail, SUFFIXES };
