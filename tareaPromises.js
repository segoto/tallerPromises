const urlProduct =
  "https://gist.githubusercontent.com/josejbocanegra/be0461060d1c2d899740b8247089ba22/raw/916d2141e32e04031bda79c8886e8e4df0ae7f24/productos.json";
const urlDetail =
  "https://gist.githubusercontent.com/josejbocanegra/7b6febf87e9d986048a648487b35e693/raw/576531a2d0e601838fc3de997e021816a4b730f8/detallePedido.json";
const XMLHttpRequest = require("xhr2");

const promise = (url) => {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.responseType = "json";
    req.open("GET", url);
    req.onload = () => {
      if (req.status === 200) {
        resolve(req.response);
      } else reject(req.status);
    };
    req.send();
  });
};

Promise.all([
  promise(urlProduct).then((response) => {
    return response.map((r) => {
      let x = {
        idproducto: r.idproducto,
        nombreProducto: r.nombreProducto,
      };
      return x;
    });
  }),
  promise(urlDetail).then((response) => {
    return response
      .reduce((acc, val) => {
        let current = acc
          .filter((obj) => obj.idproducto === val.idproducto)
          .pop() || { idproducto: val.idproducto, cantidad: 0 };
        let index = acc.indexOf(current);
        if (index !== -1) acc.splice(index, 1);
        current.cantidad += parseInt(val.cantidad);
        acc.push(current);
        return acc;
      }, [])
      .sort((a, b) => b.cantidad - a.cantidad);
  }),
])
  .then((responses) => {
    console.log(
      `el nombre del producto más vendido es ${responses[0].find(
        (product) => product.idproducto === responses[1][0].idproducto
      ).nombreProducto} y se vendieron ${responses[1][0].cantidad} unidades`
    );
  })
  .catch((err) => console.log(err));
