const $ = (id) => document.getElementById(id);
let current = "";
function notice(t) {
  $("notice").textContent = t;
  $("notice").style.display = t ? "block" : "none";
}
function fill(x) {
  $("welcome_channel").value = x.welcome_channel_id ?? "";
  $("welcome_message").value = x.welcome_message ?? "";
  $("log_channel").value = x.log_channel_id ?? "";
  $("automod_enabled").checked = !!x.automod_enabled;
  $("anti_invite").checked = !!x.anti_invite;
  $("automod_words").value = Array.isArray(x.automod_words)
    ? x.automod_words.join(", ")
    : "";
  $("level_message").value =
    x.level_message || "GG {user}, you reached level {level}!";
}
$("load").onclick = async () => {
  current = $("guild").value.trim();
  if (!current) return notice("Masukkan Discord Server ID.");
  try {
    let r = await fetch(`/api/settings/${current}`);
    if (!r.ok) throw Error();
    fill(await r.json());
    notice("");
  } catch (e) {
    notice(
      "Gagal mengambil settings. Pastikan server ID benar dan backend aktif.",
    );
  }
};
$("save").onclick = async () => {
  if (!current) current = $("guild").value.trim();
  if (!current) return notice("Masukkan Discord Server ID.");
  let body = {
    guild_id: Number(current),
    welcome_channel_id: $("welcome_channel").value
      ? Number($("welcome_channel").value)
      : null,
    welcome_message: $("welcome_message").value || null,
    log_channel_id: $("log_channel").value
      ? Number($("log_channel").value)
      : null,
    automod_enabled: $("automod_enabled").checked,
    anti_invite: $("anti_invite").checked,
    automod_words: $("automod_words")
      .value.split(",")
      .map((x) => x.trim())
      .filter(Boolean),
    level_message: $("level_message").value,
  };
  try {
    let r = await fetch(`/api/settings/${current}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw Error();
    $("status").textContent = "✓ Settings saved";
    setTimeout(() => ($("status").textContent = ""), 2500);
  } catch (e) {
    $("status").textContent = "✕ Save failed";
  }
};
document.querySelectorAll(".server").forEach(
  (b) =>
    (b.onclick = () => {
      document
        .querySelectorAll(".server")
        .forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      notice(
        "Panel ini sudah disiapkan; pengaturan yang aktif saat ini adalah Server Settings.",
      );
    }),
);
