module.exports = {
    invalidateMenu: invalidateMenu,
    getMenuItems: getMenuItems
}

function invalidateMenu() {

}

function getMenuItems(callback) {
    callback(menuItems);
}

var menuItems = [
    {
        displayName: 'Alertas',
        appId: 1
    },
    {
        displayName: 'Fornecedores',
        appId: 2
    },
    {
        displayName: 'Material',
        appId: 3,
        subSections: [
            {
                displayName: 'Discos',
                appId:4,
                subSections: [
                    {
                        displayName: 'son1',
                        appId:5,
                    },
                    {
                        displayName: 'son2',
                        appId:5
                    }
                ]
            },
            {
                displayName: 'Parafusos',
                appId:5,
                subSections: [
                    {
                        displayName: 'son1',
                        appId:5
                    },
                    {
                        displayName: 'son2',
                        appId:5
                    }
                ]
            },
            {
                displayName: 'Porcas',
                appId:5,
                subSections: [
                    {
                        displayName: 'son1',
                        appId:5
                    },
                    {
                        displayName: 'son2',
                        appId:5,
                    }
                ]
            },
            {
                displayName: 'Sprays',
                appId:5,
                subSections: [
                    {
                        displayName: 'son1',
                        appId:5
                    },
                    {
                        displayName: 'son2',
                        appId:5
                    }
                ]
            }
        ]
    }
];