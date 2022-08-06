const flash = function (response, text) {
  new Noty({
    theme: "relax",
    text: text,
    type: response,
    layout: "topRight",
    timeout: 1500,
  }).show();
};
