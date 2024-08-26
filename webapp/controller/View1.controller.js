sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,Fragment) {
        "use strict";

        return Controller.extend("migo.controller.View1", {
            onInit: function () {
                var oModel = new JSONModel();

                this.getView().setModel(oModel, "UpdateModel");

            },
            // onValueHelpRequest:function(oEvent)
            // {
            //     var oView = this.getView();

            //     if (!this._pValueHelpDialog) {
            //         this._pValueHelpDialog = Fragment.load({
            //             id: oView.getId(),
            //             name: "migo.Fragment.valueHelp",
            //             controller: this
            //         }).then(function (oValueHelpDialog){
            //             oView.addDependent(oValueHelpDialog);
            //             return oValueHelpDialog;
            //         });
            //     }
            //     this._pValueHelpDialog.then(function(oValueHelpDialog){
                     
            //         oValueHelpDialog.open();
            //     }.bind(this));
            // },
            onValueHelpRequest: function () {
                var that = this;
                var dialog = new sap.m.Dialog({
                  title: "Select Gate Entry NO ",
                  contentWidth: "80px",
                  contentHeight: "300px",
                  content: new sap.ui.table.Table({
                    columns: [
        
                      new sap.ui.table.Column({
                        label: "Gate Entry NO",
                        template: new sap.m.Text({ text: "{Vendor>gentry_num}" })
                      })
        
                    ],
                    rows: {
                      path: "Vendor>/value",
                      template: new sap.ui.table.Row({
                        cells: [
                          new sap.m.Text({ text: "{Vendor>gentry_num}" })
        
        
                        ]
                      })
                    },
                    selectionMode: sap.ui.table.SelectionMode.Single,
                    selectionBehavior: sap.ui.table.SelectionBehavior.RowOnly
                  }),
                  beginButton: new sap.m.Button({
                    text: "OK",
                    press: function () {
                      var selectedItem = dialog.getContent()[0].getSelectedIndices()[0];
                      if (selectedItem >= 0) {
                        var UpdateModel = dialog.getContent()[0].getModel("Vendor");
                        var selectedGateNum = UpdateModel.getProperty("/value/" + selectedItem + "/gentry_num");
        
                        var inputField = that.getView().byId("gateEnt");
                        inputField.setValue(selectedGateNum);
                        inputField.fireEvent("change");
                      }
                      dialog.close();
                    }
                  })
                });
        
                var UpdateModel = new sap.ui.model.json.JSONModel();
        
                // Fetch the data from the API
                fetch("/sap/opu/odata4/sap/z_sb_gate_entry_rep/srvd/sap/z_sd_gate_entry_rep/0001/ZI_GATE_ENTRY_REPORT", {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json"
                  }
                })
                  .then(response => response.json())
                  .then(data => {
                    if (UpdateModel) {
                      UpdateModel.setData({ value: data.value });
                     // console.log("UpdateModel:", UpdateModel.getData());
                    //  console.log("datamodelopenqty", data.value);
        
                      // Attach the model to the dialog's table
                      dialog.getContent()[0].setModel(UpdateModel, "Vendor");
                    } else {
                      console.error("JSON model not found.");
                    }
                  })
                  .catch(error => {
                    // Handle error
                    console.error(error);
                  });
        
                // Open the dialog
                dialog.open();
        
                // Handle the OK button press
                dialog.getBeginButton().attachPress(function () {
                  var selectedItemIndex = dialog.getContent()[0].getSelectedIndex();
                  if (selectedItemIndex >= 0) {
                    var selectedData = UpdateModel.getProperty("/value/" + selectedItemIndex);
        
                  //  console.log("selectedData", selectedData);
        
        
                  }
                });
        
              },
            onSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Name", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            },
            
          
        });
    });
