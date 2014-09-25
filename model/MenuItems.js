module.exports = {
    invalidateMenu: invalidateMenu,
    getMenuItems: getMenuItems
}

function invalidateMenu() {

}

function getMenuItems(callback) {
    callback(menuItems);
}
var fornecedores = {
    displayName: 'Fornecedores',
    appId: 2,
    subSections: [ { displayName: 'Berner', appId: 81 },
        { displayName: 'Wurth', appId: 82 } ]
}

var materiais = {
    displayName: 'Material',
    appId: 9,
    subSections: [
        {
            displayName: 'Parafusos',
            appId:5,
            subSections: [ {
                displayName: 'Quadrados',
                appId:6,
                subSections: [
                    { displayName: 'Inox', appId:'6a' }
                ]
            },
                {
                    displayName: 'Estrela', appId:7 },
                {
                    displayName: 'Pontos',
                    appId:8,
                    subSections: [
                        { displayName: 'Inox', appId:'8a' },
                        { displayName: 'Ferro', appId:'8b' }
                    ]
                }
            ]
        },
        {
            displayName: 'Porcas',
            appId:2,
            subSections: [ { displayName: 'Hexagonais', appId:'2a' } ]
        },
        {
            displayName: 'Sprays',
            appId:1,
            subSections: [ { displayName: 'DosBons', appId:'1a' } ]
        }
    ]
};

var menuItems = [
    { displayName: 'Alertas', appId: 1 },
    fornecedores,
    materiais
];