(function () {
  var params = new URLSearchParams(window.location.search);
  var motivo = params.get("motivo");
  var mensaje = params.get("mensaje");
  var motivoEl = document.getElementById("motivo");
  var mensajeEl = document.getElementById("mensaje");
  var allowed = ["Cita previa", "Información", "Paciente"];
  if (motivo && motivoEl) {
    if (allowed.indexOf(motivo) === -1) motivo = "Información";
    motivoEl.value = motivo;
  }
  if (mensaje && mensajeEl) mensajeEl.value = mensaje;

  var form = document.getElementById("form-cita");
  var ok = document.getElementById("form-ok");
  var err = document.getElementById("form-error");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (ok) ok.hidden = true;
      if (err) err.hidden = true;
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      fetch("enviar.php", {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json", "X-Requested-With": "fetch" },
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { res: res, data: data };
          });
        })
        .then(function (out) {
          if (out.data && out.data.ok) {
            form.reset();
            if (ok) {
              ok.textContent = out.data.message || "Consulta enviada.";
              ok.hidden = false;
            }
          } else {
            if (err) {
              err.textContent =
                (out.data && out.data.message) ||
                "No se ha podido enviar. Escríbenos a me@miriameguianutricion.com.";
              err.hidden = false;
            }
          }
        })
        .catch(function () {
          if (err) {
            err.textContent =
              "No se ha podido enviar. Escríbenos a me@miriameguianutricion.com o llama al 648 125 035.";
            err.hidden = false;
          }
        })
        .finally(function () {
          if (btn) btn.disabled = false;
        });
    });
  }

  if (params.get("enviado") === "1" && ok) ok.hidden = false;
  if (params.get("error") === "1" && err) err.hidden = false;

  var cover = document.getElementById("map-cover");
  var btnMap = document.getElementById("ver-mapa");
  if (btnMap && cover) {
    btnMap.addEventListener("click", function () {
      cover.outerHTML =
        '<iframe title="Mapa de la consulta en Santander" src="https://maps.google.com/maps?q=Calle%20Juan%20de%20la%20Cosa%2015%2C%2039004%20Santander&z=16&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
    });
  }
})();
