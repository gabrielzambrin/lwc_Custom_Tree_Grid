import { LightningElement, track,api } from 'lwc';


export default class Lwc_TreeGrid extends LightningElement {
    @track alldata = [];
    @track parentHeader = [];
    @track parentmapdata = [];
    @track childrenHeader = [];
    @track headersSize = 0;
    
    @api handleInit(object){
        this.parentHeader = object.parentFields.map(({label}) => label);
        this.childrenHeader = object.childrenFields.map(({label}) => label);
        this.headersSize = this.parentHeader.length;
        this.alldata = object.data;
        for (let key in this.alldata) {
            var mapDataValues = new Object();
            mapDataValues.dataValues = [];
            mapDataValues.childrenMap = [];
            
            object.parentFields.forEach(f => {
                if(f.fieldName.includes(".")){
                    if(this.alldata[key].parent[f.fieldName.split(".")[0]][f.fieldName.split(".")[1]]!=undefined){ 
                        mapDataValues.dataValues.push(this.setFieldsData(this.alldata[key].parent,this.alldata[key].parent[f.fieldName.split(".")[0]][f.fieldName.split(".")[1]], f.type,f.typeAttributes));
                    }else{
                        mapDataValues.dataValues.push({valor: '', atributos: null});
                    }
                }else{
                    if(this.alldata[key].parent[f.fieldName]!=undefined){ 
                        mapDataValues.dataValues.push(this.setFieldsData(this.alldata[key].parent,this.alldata[key].parent[f.fieldName], f.type,f.typeAttributes));
                    }else{
                        mapDataValues.dataValues.push({valor: '', atributos: null});
                    }
                }
            });
            if(this.alldata[key].children){
                this.alldata[key].children.forEach(c => {
                    var children = [];
                    object.childrenFields.forEach(f => {
                        if(f.fieldName.includes(".")){
                            if(c[f.fieldName.split(".")[0]][f.fieldName.split(".")[1]]!=undefined){
                                children.push(this.setFieldsData(c,c[f.fieldName.split(".")[0]][f.fieldName.split(".")[1]],f.type,f.typeAttributes));
                            }else{
                                children.push({valor: '', atributos: null});
                            }
                        }else{
                            if(c[f.fieldName]!=undefined){
                                children.push(this.setFieldsData(c,c[f.fieldName],f.type,f.typeAttributes));
                            }else{
                                children.push({valor: '', atributos: null});
                            }
                        }
                    });
                    mapDataValues.childrenMap.push({value:children, key:c.Id});
                })
            }
            mapDataValues.showDetail = false;
            this.parentmapdata.push({value:mapDataValues, key:this.alldata[key].parent.Id});
        }
        console.log(this.parentmapdata);
    }
    
    handleIconClick(event){
        if(event.target.iconName == 'utility:chevronright'){
            event.target.iconName = 'utility:chevrondown';
            this.parentmapdata[event.target.name].value.showDetail = true;
        }else{
            event.target.iconName = 'utility:chevronright';
            this.parentmapdata[event.target.name].value.showDetail = false;
        }
    }
    
    setFieldsData(valores,valor,tipo,atributosTipo){
        var label = '';
        if(atributosTipo == undefined){
            atributosTipo = {};
            if(tipo == "currency" || tipo == "number"){
                atributosTipo.FractionDigits = '';
            }
        }else{
            if(tipo == "navigate"){
                label = valor;
                valor = "/" + valores[atributosTipo.recordId];
            }
        }
        var data = {valor: valor, atributos: atributosTipo};
        switch (tipo) {
            case "text":
                data.isText = true;
                data.linkfy = atributosTipo.linkfy;
                break;
            case "currency":
                data.isCurrency = true;
                break;
            case "number":
                data.isNumber = true;
                break;
            case "date":
                data.isDate = true;
                break;
            case "datetime":
                data.isDateTime = true;
                break;
            case "boolean":
                data.isBoolean = true;
                break;
            case "navigate":
                data.isNavigate = true;
                data.label = label;
                break;
            case "phone":
                data.isPhone = true;
                break;
            default:
                break;
        }
        // console.log(data);
        return data;
    }
}