/*
 * Model Service
 */
angular.module('LegoForm', [])
    .factory('modelService', function () {

        /**
         * An object that is capable of holding data structure of models and also
         * provide data facility for Form object
         * @constructor
         */
        var Model = function () {

            /**
             * Model definition, indexed by model's id.
             * @type {Object}
             * @private
             */
            this._modelDef = {};

            /**
             * Model column definition, indexed by lego name.
             * @type {Object}
             * @private
             */
            this._helperMapping = {};

            /**
             * Primary model id.
             * @type {Number}
             * @private
             */
            this._primaryModelId = null;

            /**
             * Primary model's primary column's Lego name.
             * @type {Number}
             * @private
             */
            this._primaryLegoName = null;

            /**
             * Primary model's primary column's name.
             * @type {Number}
             * @private
             */
            this._primaryColumnName = null;
        };

        Model.prototype = {

            /**
             * Initiate model service by adding
             * model data and schema data into this function.
             * @param {Array} models
             * @param {Object} schemas
             */
            initModelDef: function (models, schemas) {

                var that = this, model;
                this._modelDef = _.indexBy(models, 'id');

                _.each(schemas, function (schema, modelId) {

                    model = that._modelDef[modelId];

                    // recognize the primary model.
                    if (model.role === 1) {
                        that._primaryModelId = model.id;
                    }

                    _.each(schema, function (c) {

                        // generate column's lego name
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

                        // recognize the primary column
                        if (that._primaryModelId === model.id && c['column_key_type'] == 1) {
                            that._primaryColumnName = c.column;
                            that._primaryLegoName = legoName;
                        }
                    });
                });

            },


            /**
             * Get Model definition by id.
             * @param modelId
             * @returns {Object}
             */
            getModelById: function (modelId) {
                return this._modelDef[modelId];
            },

            /**
             * Get primary model's id.
             * @returns {Number|*}
             */
            getPrimaryModelId: function () {
                return this._primaryModelId;
            },

            /**
             * Get primary model's primary column's lego name.
             * @returns {string|*}
             */
            getPrimaryLegoName: function () {
                return this._primaryLegoName;
            },

            /**
             * Get primary model's primary column's name.
             * @returns {Number|*}
             */
            getPrimaryColumnName: function () {
                return this._primaryColumnName;
            }
        };

        return {Model: Model};
    });
