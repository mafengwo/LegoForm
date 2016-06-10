/*
 * Model Service
 */
angular.module('LegoForm')
    .service('modelService', function () {


        /**
         * Model definition, indexed by model's id.
         * @type {Object}
         * @private
         */
        var _modelDef = {};


        /**
         * Model column definition, indexed by lego name.
         * @type {Object}
         * @private
         */
        var _helperMapping = {};

        /**
         * Primary model id.
         * @type {Number}
         * @private
         */
        var _primaryModelId;

        /**
         * Primary model's primary column's Lego name.
         * @type {Number}
         * @private
         */
        var _primaryLegoName;

        /**
         * Primary model's primary column's name.
         * @type {Number}
         * @private
         */
        var _primaryColumnName;


        /**
         * Initiate model service by adding
         * model data and schema data into this function.
         * @param {Array} models
         * @param {Object} schemas
         */
        this.initModelDef = function (models, schemas) {

            var model;
            _modelDef = _.indexBy(models, 'id');

            _.each(schemas, function (schema, modelId) {

                model = _modelDef[modelId];

                // recognize the primary model.
                if (model.role === 1) {
                    _primaryModelId = model.id;
                }

                _.each(schema, function (c) {

                    // generate column's lego name
                    var legoName = [model.kind, c.column, model.id, c.id].join('$$');

                    _helperMapping[legoName] = {
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
                    if (_primaryModelId === model.id && c['column_key_type'] == 1) {
                        _primaryColumnName = c.column;
                        _primaryLegoName = legoName;
                    }
                });
            });

        };

        /**
         * Get Model definition by id.
         * @param modelId
         * @returns {Object}
         */
        this.getModelById = function (modelId) {
            return _modelDef[modelId];
        };

        /**
         * Get primary model's id.
         * @returns {Number|*}
         */
        this.getPrimaryModelId = function () {
            return _primaryModelId;
        };

        /**
         * Get primary model's primary column's lego name.
         * @returns {string|*}
         */
        this.getPrimaryLegoName = function () {
            return _primaryLegoName;
        };

        /**
         * Get primary model's primary column's name.
         * @returns {Number|*}
         */
        this.getPrimaryColumnName = function () {
            return _primaryColumnName;
        };

        /**
         * Get schema info by lego name.
         * @param legoName
         * @returns {object}
         */
        this.getSchemaByLegoName = function (legoName) {

            return _helperMapping[legoName];
        };
    });        