var config = {
  user1: {
    pseudo: 'charlie',
    password: 'charlie'
  },
  user2: {
    pseudo: 'java',
    password: '1224*'
  },
  user3: {
    pseudo: 'chouby',
    password: '0430#'
  },
  group1: {
    name: 'chambres'
  },
  group2:{
    name: 'nuit'
  },
  group3:{
    name: 'bureau'
  },
  device1:{
    name:'lampe_couloir',
    uid: '111134'
  },
  device2:{
    name:'lampe_chambre_1',
    uid: '111135',
    id : 5
  },
  device3:{
    name:'lampe_chambre_2',
    uid: '111136'
  },
  device4:{
    name:'lampe_bureau',
    uid: '111137'
  }
};

module.exports = function(obj) {
  for (var a in config) {
    if (config.hasOwnProperty(a)) {
      obj[a] = config[a];
    }
  }
};