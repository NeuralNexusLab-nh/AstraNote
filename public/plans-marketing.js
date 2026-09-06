"use strict";

(() => {
  const COPY = {
    en: {
      eyebrow: "CHOOSE WHAT MATTERS",
      title: "Three upgrades. Three different reasons to choose them.",
      body:
        "Plus keeps everyday notes organized. Pro adds AstraZero for text that deserves deeper privacy. Ultra adds recovery for notes you do not want one mistake to erase. Every paid plan keeps the same fast, browser-first AstraNote experience.",
      plusRole: "ORGANIZE",
      plusPitch:
        "Pins, archive, batch management, and AstraConfidential. Plus is for when AstraNote becomes part of your everyday flow.",
      proRole: "PROTECT",
      proPitch:
        "AstraZero, unlimited notes, and everything in Plus. Pro is the privacy-focused tier for text that matters more.",
      ultraRole: "RECOVER",
      ultraPitch:
        "Recovery, Trash, a previous version, AstraZero, and the highest limits. Ultra gives important text a way back after mistakes."
    },
    "zh-Hant": {
      eyebrow: "選你真正需要的能力",
      title: "三種升級，三個完全不同的理由。",
      body:
        "Plus 把日常整理好，Pro 用 AstraZero 保護真正重要的文字，Ultra 再加上復原功能，讓誤刪或改錯還有回頭路。每個付費方案都保留 AstraNote 原本快速、直接、瀏覽器即用的體驗。",
      plusRole: "整理",
      plusPitch:
        "釘選、封存、批次管理，加上 AstraConfidential。當 AstraNote 開始融入每天的使用，Plus 讓內容保持有序。",
      proRole: "保護",
      proPitch:
        "AstraZero、無限筆記，加上 Plus 的全部能力。當文字真的重要，Pro 把重點放在更深的隱私保護。",
      ultraRole: "復原",
      ultraPitch:
        "復原、垃圾桶、上一版本、AstraZero，以及最高使用限制。重要的文字，不該因為一次誤刪或改錯就真的消失。"
    },
    ja: {
      eyebrow: "本当に必要な機能を選ぶ",
      title: "3つのアップグレード。選ぶ理由も3つ。",
      body:
        "Plusは日常の整理、ProはAstraZeroによるより深いプライバシー、Ultraはミスから戻るための復元機能が中心です。どの有料プランでも、AstraNoteの速くて直接的なブラウザ体験はそのままです。",
      plusRole: "整理",
      plusPitch:
        "ピン留め、アーカイブ、一括管理、AstraConfidential。AstraNoteを日常的に使い始めたとき、Plusが整理を支えます。",
      proRole: "保護",
      proPitch:
        "AstraZero、ノート無制限、Plusの全機能。大切な文字に、より深いプライバシーが必要な人向けです。",
      ultraRole: "復元",
      ultraPitch:
        "復元、ごみ箱、前のバージョン、AstraZero、最大の利用枠。大切な文字に、ミスから戻る余地を残します。"
    }
  };

  const normalizeLocale = (value) => {
    const lang = String(value || "").toLowerCase();
    if (lang.startsWith("zh")) return "zh-Hant";
    if (lang.startsWith("ja")) return "ja";
    return "en";
  };

  const getCopy = () =>
    COPY[normalizeLocale(document.documentElement.lang || navigator.language)] || COPY.en;

  const ensurePlanPitch = (plan, roleKey, pitchKey) => {
    const card = document.querySelector(`[data-plan="${plan}"]`);
    if (!card) return;

    let block = card.querySelector("[data-plan-marketing]");
    if (!block) {
      block = document.createElement("div");
      block.setAttribute("data-plan-marketing", "");

      const role = document.createElement("p");
      const roleStrong = document.createElement("strong");
      roleStrong.setAttribute("data-plan-marketing-role", "");
      role.appendChild(roleStrong);

      const pitch = document.createElement("p");
      pitch.className = "muted";
      pitch.setAttribute("data-plan-marketing-pitch", "");

      block.append(role, pitch);
      const features = card.querySelector(".plan-features");
      if (features) card.insertBefore(block, features);
      else card.appendChild(block);
    }

    const copy = getCopy();
    const roleNode = block.querySelector("[data-plan-marketing-role]");
    const pitchNode = block.querySelector("[data-plan-marketing-pitch]");
    if (roleNode) roleNode.textContent = copy[roleKey];
    if (pitchNode) pitchNode.textContent = copy[pitchKey];
  };

  const applyCopy = () => {
    const copy = getCopy();

    const eyebrow = document.querySelector('[data-i18n="plansEyebrow"]');
    const title = document.querySelector('[data-i18n="plansTitle"]');
    const body = document.querySelector('[data-i18n="plansBody"]');

    if (eyebrow) eyebrow.textContent = copy.eyebrow;
    if (title) title.textContent = copy.title;
    if (body) body.textContent = copy.body;

    ensurePlanPitch("plus", "plusRole", "plusPitch");
    ensurePlanPitch("pro", "proRole", "proPitch");
    ensurePlanPitch("ultra", "ultraRole", "ultraPitch");
  };

  applyCopy();

  new MutationObserver((records) => {
    if (records.some((record) => record.attributeName === "lang")) applyCopy();
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });
})();
