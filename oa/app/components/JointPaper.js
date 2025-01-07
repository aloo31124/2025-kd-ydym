Ext.define('OA.components.JointPaper', {
    extend: 'Ext.Container',
    xtype: "jointPaper",
    requires: [],
    config: {
        layout: "vbox",
        ui: 'light',
        items: [
            {
                html: '<div id="jointGraph"></div>'
            }
        ],
        jointPaper: null
    },
    createJointGraph: function () {
        var paper = this.getJointPaper();
        var graph;
        if (paper == null) {
            graph = new joint.dia.Graph;
            paper = new joint.dia.Paper({
                el: $('#jointGraph'),
                model: graph
            });
            this.setJointPaper(paper);
        } else {
            graph = paper.model;
        }
        graph.clear();
        var workflows = OA.common.Utils.getWorkFlowData();
        //console.log(JSON.stringify(workflows));
        var uml = joint.shapes.uml;
        var states = {}, transitons = [], _x = 20, _y = -80, _preStates = null, _preData = null, _thread = 0, _source = null, _muti = [];
        var tspanX = 0;
        Ext.each(workflows, function (p) {
            //'目前' == p.flag

            tspanX = (10 - p.empName.length ) * 13;
            //目標
            var _attrs = {'.uml-state-events > tspan': {dy: '10', x: tspanX, 'font-size': '20'}};
            if (p.jobNo == OA.common.Global.getDestJobNo()) {
                //_attrs['rect']={fill: '#00FFFF'};
                _attrs['rect'] = {fill: 'red'};
            }

            if (p.nodeMethod === '2') { // 併行
                _x = _x + _thread * 280;
                _thread++;
                if (_preData.nodeMethod !== '2')
                    _y = _y + 90;
            } else {
                _x = 20;
                _y = _y + 90;

                if (_preStates) {
                    _source = {id: _preStates.id};
                }
            }
            states[p.jobNo] = new uml.State({
                position: {x: _x, y: _y},
                size: {width: 250, height: 60},
                name: p.nodeTypeDesc + " " + p.depName + " " + p.jobName,
                events: [p.empName],
                attrs: _attrs
            });

            if (_preStates) {
                if (p.nodeMethod === '1' && _preData.nodeMethod === '2') {
                    Ext.each(_muti, function (m) {
                        //console.log(m);
                        transitons.push(new uml.Transition({source: {id: m.id}, target: {id: states[p.jobNo]}}));
                    });
                    _muti = [];
                } else {
                    transitons.push(new uml.Transition({source: _source, target: {id: states[p.jobNo].id}}));
                }
            } else {
                _source = {id: states[p.jobNo].id};
            }

            if (p.nodeMethod === '2') { // 併行
                _muti.push(states[p.jobNo]);
            }

            _preData = p;
            _preStates = states[p.jobNo];

        });
        paper.setDimensions(800, _y + 100);
        graph.addCells(states);
        graph.addCells(transitons);


    }
});