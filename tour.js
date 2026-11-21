/* Virtual tour 360° (Pannellum). Ganti file panorama (di folder yang sama dengan index.html) sesuai foto Anda. */
(function () {
  var el = document.getElementById('vt-pano');
  if (!el || !window.pannellum) return;

  // Foto 360 (equirectangular, rasio 2:1). Placeholder sementara: ganti dengan "teras.jpg" dst.
  var PLACEHOLDER = 'https://pannellum.org/alma.jpg';
  var SCENES = {
    teras:   { title: 'Teras & carport', img: PLACEHOLDER, yaw: 0,   links: [{ to: 'tamu',   yaw: 90,  text: 'Ruang tamu' }] },
    tamu:    { title: 'Ruang tamu',      img: PLACEHOLDER, yaw: 90,  links: [{ to: 'teras',  yaw: -90, text: 'Teras' }, { to: 'dapur', yaw: 60, text: 'Dapur' }, { to: 'kamar', yaw: 160, text: 'Kamar' }] },
    dapur:   { title: 'Dapur',           img: PLACEHOLDER, yaw: 180, links: [{ to: 'tamu',   yaw: 0,   text: 'Ruang tamu' }] },
    kamar:   { title: 'Kamar utama',     img: PLACEHOLDER, yaw: -45, links: [{ to: 'tamu',   yaw: 20,  text: 'Ruang tamu' }] }
  };

  var cfg = { default: { firstScene: 'teras', sceneFadeDuration: 800, autoLoad: true, hfov: 100, minHfov: 50, maxHfov: 120, compass: false, showFullscreenCtrl: true, showZoomCtrl: true, mouseZoom: true, orientationOnByDefault: false }, scenes: {} };
  Object.keys(SCENES).forEach(function (k) {
    var s = SCENES[k];
    cfg.scenes[k] = {
      title: s.title, type: 'equirectangular', panorama: s.img, yaw: s.yaw, pitch: 0,
      hotSpots: s.links.map(function (l) { return { pitch: -8, yaw: l.yaw, type: 'scene', sceneId: l.to, text: l.text, cssClass: 'vt-hot' }; })
    };
  });

  var viewer = pannellum.viewer('vt-pano', cfg);

  var bar = document.getElementById('vt-scenes');
  Object.keys(SCENES).forEach(function (k) {
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = SCENES[k].title; b.dataset.scene = k;
    b.addEventListener('click', function () { viewer.loadScene(k); });
    bar.appendChild(b);
  });
  function mark() { var cur = viewer.getScene(); [].forEach.call(bar.children, function (b) { b.classList.toggle('on', b.dataset.scene === cur); }); }
  viewer.on('scenechange', mark); viewer.on('load', mark);

  // Tab: tur 360 / Google Maps
  var tabs = document.querySelectorAll('.vt-tabs button');
  [].forEach.call(tabs, function (t) {
    t.addEventListener('click', function () {
      var map = t.dataset.vt === 'map';
      [].forEach.call(tabs, function (x) { x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
      document.getElementById('vt-tour').hidden = map;
      document.getElementById('vt-map').hidden = !map;
      bar.hidden = map;
      if (!map) viewer.resize();
    });
  });
})();
