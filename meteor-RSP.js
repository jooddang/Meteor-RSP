// initialize mongo
RSP = new Mongo.Collection('RSP');

var p1_db = RSP.find({id: 'player1_choice'}).fetch();
var p2_db = RSP.find({id: 'player2_choice'}).fetch();

if (p1_db.length > 0) {
  for (var i = 0; i < p1_db.length; i++) {
    RSP.remove({_id: p1_db[i]._id});
  }
}
RSP.insert({id: 'player1_choice', value: -1}); 

if (p2_db.length > 0) {
  for (var i = 0; i < p2_db.length; i++) {
    RSP.remove({_id: p2_db[i]._id});
  }
}
RSP.insert({id: 'player2_choice', value: -1}); 

// routing
Router.route('/', function () {
  this.render('hello');
});

Router.route('/player1', function () {
  this.render('player1');
});

Router.route('/player2', function () {
  this.render('player2');
});

if (Meteor.isClient) {

  var mapping = {0: 'Rock', 1: 'Scissors', 2: 'Paper'};

  Template.commonUI.helpers({
    result: function() {
      var p1 = RSP.find({id: 'player1_choice'}).fetch()[0].value;
      var p2 = RSP.find({id: 'player2_choice'}).fetch()[0].value;

      if (p1 == -1 && p2 == -1) {
        return '';
      } else if (p1 == -1 || p2 == -1) {
        return 'Wait...';
      } else {

        var r1 = 'Player1 [' + mapping[p1] + '], Player2 [' + mapping[p2] + ']. ';
        var r2 = 'Player2 won the game.';
        if ( (p1-p2) == -1 || (p1-p2) == 2) {
          r2 = 'Player1 won the game.';
        } else if ( (p1 - p2) == 0) {
          r2 = 'Draw the game.';
        }
        return r1 + r2;
      }
    }
  });

  Template.player1.events({
    'click button': function(event) {
      var p1_db = RSP.find({id: 'player1_choice'}).fetch()[0];
      var button_id = parseInt(event.currentTarget.id);
      if (isNaN(button_id)) {
        RSP.update({_id: p1_db._id}, {$set: {value: -1}});
      } else {
        RSP.update({_id: p1_db._id}, {$set: {value: button_id}});
      }
    }
  });

  Template.player2.events({
    'click button': function(event) {
      var p2_db = RSP.find({id: 'player2_choice'}).fetch()[0];
      var button_id = parseInt(event.currentTarget.id);
      if (isNaN(button_id)) {
        RSP.update({_id: p2_db._id}, {$set: {value: -1}});
      } else {
        RSP.update({_id: p2_db._id}, {$set: {value: button_id}});
      }
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
