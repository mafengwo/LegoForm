/**
 * Created by mafengwo on 16/5/31.
 */
angular.module('LegoForm', [])
    .factory('modelService', function () {

        var Model = function () {

            this._modelDef = {};
            this._helperMapping = {};
            this._primaryModelId = null;
            this._primaryLegoName = null;
            this._primaryColumnName = null;
        };

        Model.prototype = {


            initModelDef: function (models, schemas) {

                var that = this, model;
                this._modelDef = _.indexBy(models, 'id');

                _.each(schemas, function (schema, modelId) {

                    model = that._modelDef[modelId];

                    if (model.role === 1) {
                        that._primaryModelId = model.id;
                    }

                    _.each(schema, function (c) {

                        var legoName = [model.kind, c.column, model.id, c.id].join('$$');

                        that._helperMapping[legoName] = {
                            col_id: c.id,
                            column: c.column,
                            model_id: model.id,
                            kind: model.kind,
                            relationship: model.relationship,
                            role: model.role,
                            default_value: c['column_data_default_value'],
                            data_type: c['column_data_type'],
                            key_type: c['column_key_type'],
                            one_with_more: model.relationship === 1
                        };
                        if (that._primaryModelId === model.id && c['column_key_type'] == 1) {
                            that._primaryColumnName = c.column;
                            that._primaryLegoName = legoName;
                        }
                    });
                });

            },


            getModelById: function (modelId) {
                return this._helperMapping[modelId];
            },

            getPrimaryModelId: function () {
                return this._primaryModelId;
            },

            getPrimaryLegoName: function () {
                return this._primaryLegoName;
            },

            getPrimaryColumnName: function () {
                return this._primaryColumnName;
            }
        };


        return {Model: Model};
    });
