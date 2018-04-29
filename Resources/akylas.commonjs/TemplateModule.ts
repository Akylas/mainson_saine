

export interface _Template {
    [k:string]:any
    bindId?:string
    properties?:TiDict
    events?:{[k:string]:Function}
    childTemplates?:AK.Template[] 
}


export default class _TemplateModule {
    [key: string]: AK.Template | Function | void
    prepareTemplate(_template: AK.Template, _type?: string, _defaults?: TiDict): TiDict | void { }
    constructor(options?) {
        this.prepareTemplate = ak.ti.style;
        if (options) {
            Object.assign(this, options);
        }
    }
    internalAddEvents = (_template: AK.Template, _properties?: TiDict) => {
        if (!_template || !_properties) return;
        var props;
        if (_properties.hasOwnProperty('events')) {
            props = _template.events || _template;
            _template.events = _template.events || {};
            Object.assignDeep(_template.events, _properties.events);
            delete _properties.events;
        }
        if (_template.bindId && _properties.hasOwnProperty(_template.bindId)) {
            _template.events = _template.events || {};
            Object.assignDeep(_template.events, _properties[_template.bindId]);
            delete _properties[_template.bindId];
            // delete _template.bindId;
        }
        if (Object.keys(_properties).length === 0) return true;
        _template.childTemplates && _template.childTemplates.forEach(function (ele, i, list) {
            return !this.internalAddEvents(ele, _properties);
        }, this);
    }
    internalAddProperties = (_template: TiDict, _properties?: TiDict) => {

        if (!_template || !_properties) return;
        // var props;
        if (_properties.hasOwnProperty('properties')) {
            var props = _template.properties || _template;
            Object.assignDeep(props, _properties.properties);
            delete _properties.properties;
        }

        const objs = Object.findDeep(_template, 'bindId');
        objs.forEach(obj => {
            var binding = obj.bindId;
            if (_properties.hasOwnProperty(obj.bindId)) {
                // props = obj.properties || obj;
                Object.assignDeep(obj.properties || obj, _properties[binding]);
            }
        });
        // if (_template.bindId && _properties.hasOwnProperty(_template.bindId)) {
        //     props = _template.properties || _template;
        //     Object.assignDeep(props, _properties[_template.bindId]);
        //     delete _properties[_template.bindId];
        //     // delete _template.bindId;
        // }
        // if (Object.keys(_properties).length === 0) return true;
        // _template.childTemplates && _template.childTemplates.forEach(function (ele, i, list) {
        //     return !this.internalAddProperties(ele, _properties);
        // }, this);

    }
    addProperties = (_template, _properties?) => {
        if ((typeof _template === 'string')) {
            this.internalAddProperties(this.getTemplate(_template), _properties);
        } else {
            this.internalAddProperties(_template, _properties);
        }
    }

    cloneTemplate = (_template: string, _events?) => {
        var template = this.getTemplate(_template);
        if (template) {
            template = JSON.parse(JSON.stringify(template));
            if (_events) {
                _events.forEach(function (value, key, list) {
                    this.internalAddEvents(template, key, value);
                }, this);
            }
            return template;
        }
        return null;
    }



    cloneTemplateAndFill = (_template, _properties?, _events?) => {
        var template:AK.Template = (Object.isObject(_template)) ? _template : this.getTemplate(_template);
        // console.debug('cloneTemplateAndFill', _template, _properties);
        if (template) {
            template = JSON.parse(JSON.stringify(template));
            if (_properties) {
                this.internalAddProperties(template, _properties);
            }
            if (_events) {
                this.internalAddEvents(template, _events);
            }
            return template;
        }
        return null;
    }
    getTemplate = (_key: string) => {
        return this[_key] as AK.Template;
    }
    addTemplate = (_template, _key: string) => {
        this[_key] = this.prepareTemplate(_template);
    }
}

declare global {
    type TemplateModule =_TemplateModule
    module AK {
        class TemplateModule extends _TemplateModule { }
        interface Template extends _Template { }
    }
}