var express = require('express'),
    router = express.Router();

var dashboard = {
  "items": [{
    "id": "100009",
    "title": "UXUI Team Website",
    "thumb": "100009.jpg",
    "authors": [{
      "name": "Ken",
      "thumb": "ken.jpg"
    },{
      "name": "Cynthia",
      "thumb": "cynthia.jpg"
    }, {
      "name": "Manuele",
      "thumb": "manuele.jpg"
    }, {
      "name": "Richa",
      "thumb": "richa.jpg"
    }, {
      "name": "Santiago",
      "thumb": "santiago.jpg"
    }],
    "description": "Sesame snaps candy pie chocolate bar chocolate. Croissant caramels brownie candy danish cupcake cupcake soufflé liquorice. Liquorice fruitcake cookie ice cream gingerbread marzipan. Caramels fruitcake chocolate carrot cake sweet roll topping. Pudding lemon drops icing tart caramels. Lemon drops toffee powder.",
    "category": "UX/UI",
    "product": "SUSE openstack cloud",
    "link": "http://suse.com"
  }, {
    "id": "100001",
    "title": "SCC 404",
    "thumb": "100001.jpg",
    "authors": [{
      "name": "Cynthia",
      "thumb": "cynthia.jpg"
    }],
    "description": "Sesame snaps candy pie chocolate bar chocolate. Croissant caramels brownie candy danish cupcake cupcake soufflé liquorice. Liquorice fruitcake cookie ice cream gingerbread marzipan. Caramels fruitcake chocolate carrot cake sweet roll topping. Pudding lemon drops icing tart caramels. Lemon drops toffee powder.",
    "category": "UX/UI",
    "product": "SUSE customer center",
    "link": "http://scc.suse.com"
  }, {
    "id": "100002",
    "title": "Open QA",
    "thumb": "100002.jpg",
    "authors": [{
      "name": "Manuele",
      "thumb": "manuele.jpg"
    }],
    "description": "Sesame snaps candy pie chocolate bar chocolate. Croissant caramels brownie candy danish cupcake cupcake soufflé liquorice. Liquorice fruitcake cookie ice cream gingerbread marzipan. Caramels fruitcake chocolate carrot cake sweet roll topping. Pudding lemon drops icing tart caramels. Lemon drops toffee powder.",
    "category": "UX/UI",
    "product": "Open QA",
    "link": "http://scc.suse.com"
  }, {
    "id": "100003",
    "title": "SCC 404",
    "thumb": "100003.jpg",
    "authors": [{
      "name": "Cynthia",
      "thumb": "cynthia.jpg"
    }, {
      "name": "Ken",
      "thumb": "ken.jpg"
    }, {
      "name": "Manuele",
      "thumb": "manuele.jpg"
    }, {
      "name": "Richa",
      "thumb": "richa.jpg"
    }, {
      "name": "Santiago",
      "thumb": "santiago.jpg"
    }],
    "description": "Sesame snaps candy pie chocolate bar chocolate. Croissant caramels brownie candy danish cupcake cupcake soufflé liquorice. Liquorice fruitcake cookie ice cream gingerbread marzipan. Caramels fruitcake chocolate carrot cake sweet roll topping. Pudding lemon drops icing tart caramels. Lemon drops toffee powder.",
    "category": "UX/UI",
    "product": "SUSE openstack cloud",
    "link": "http://suse.com"
  }, {
    "id": "100004",
    "title": "item 2",
    "thumb": "100004.jpg",
    "authors": [{
      "name": "Manuele",
      "thumb": "manuele.jpg"
    }, {
      "name": "Richa",
      "thumb": "richa.jpg"
    }],
    "description": "Sesame snaps candy pie chocolate bar chocolate. Croissant caramels brownie candy danish cupcake cupcake soufflé liquorice. Liquorice fruitcake cookie ice cream gingerbread marzipan. Caramels fruitcake chocolate carrot cake sweet roll topping. Pudding lemon drops icing tart caramels. Lemon drops toffee powder.",
    "category": "UX/UI",
    "product": "SUSE openstack cloud",
    "link": "http://suse.com"
  }, {
    "id": "100005",
    "title": "item 2",
    "thumb": "100005.jpg",
    "authors": [{
      "name": "Manuele",
      "thumb": "manuele.jpg"
    }, {
      "name": "Richa",
      "thumb": "richa.jpg"
    }],
    "description": "Sesame snaps candy pie chocolate bar chocolate. Croissant caramels brownie candy danish cupcake cupcake soufflé liquorice. Liquorice fruitcake cookie ice cream gingerbread marzipan. Caramels fruitcake chocolate carrot cake sweet roll topping. Pudding lemon drops icing tart caramels. Lemon drops toffee powder.",
    "category": "UX/UI",
    "product": "SUSE openstack cloud",
    "link": "http://suse.com"
  }, {
    "id": "100006",
    "title": "UXUI Logo",
    "thumb": "100006.jpg",
    "authors": [{
      "name": "Cynthia",
      "thumb": "cynthia.jpg"
    },],
    "description": "Sesame snaps candy pie chocolate bar chocolate. Croissant caramels brownie candy danish cupcake cupcake soufflé liquorice. Liquorice fruitcake cookie ice cream gingerbread marzipan. Caramels fruitcake chocolate carrot cake sweet roll topping. Pudding lemon drops icing tart caramels. Lemon drops toffee powder.",
    "category": "UX/UI",
    "product": "SUSE openstack cloud",
    "link": "http://suse.com"
  }, {
    "id": "100007",
    "title": "item 2",
    "thumb": "100007.jpg",
    "authors": [{
      "name": "Zvezdana",
      "thumb": "zvezdana.jpg"
    }],
    "description": "Sesame snaps candy pie chocolate bar chocolate. Croissant caramels brownie candy danish cupcake cupcake soufflé liquorice. Liquorice fruitcake cookie ice cream gingerbread marzipan. Caramels fruitcake chocolate carrot cake sweet roll topping. Pudding lemon drops icing tart caramels. Lemon drops toffee powder.",
    "category": "UX/UI",
    "product": "SUSE openstack cloud",
    "link": "http://suse.com"
  }, {
    "id": "100008",
    "title": "item 2",
    "thumb": "100008.jpg",
    "authors": [{
      "name": "Ken",
      "thumb": "ken.jpg"
    },{
      "name": "Cynthia",
      "thumb": "cynthia.jpg"
    }, {
      "name": "Manuele",
      "thumb": "manuele.jpg"
    }, {
      "name": "Richa",
      "thumb": "richa.jpg"
    }, {
      "name": "Santiago",
      "thumb": "santiago.jpg"
    }],
    "description": "Sesame snaps candy pie chocolate bar chocolate. Croissant caramels brownie candy danish cupcake cupcake soufflé liquorice. Liquorice fruitcake cookie ice cream gingerbread marzipan. Caramels fruitcake chocolate carrot cake sweet roll topping. Pudding lemon drops icing tart caramels. Lemon drops toffee powder.",
    "category": "UX/UI",
    "product": "SUSE openstack cloud",
    "link": "http://suse.com"
  }],
  "meta": {
    "results": "12",
    "page": "1"
  }
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).json(dashboard);
});

module.exports = router;
