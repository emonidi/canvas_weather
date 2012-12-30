var foreCastModel =  Backbone.Model.Extend({
	
});

var Collection = new Backbone.Collection.Extend({
	model: foreCastModel,
	initialize:function(){
		$("body").append("collection initialized");
	}
	
});

var coll = new Collection;

