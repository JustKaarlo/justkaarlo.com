const collmenu = [
    {
        title: 'ITEM-1',
        subtitle: 'SUB-1',
        icon: '../../res/core/assets/collections.svg',
        link: '',
        contentType: 'link'
    },
    {
        title: 'ITEM-2',
        subtitle: 'SUB-2',
        icon: '../../res/core/assets/collections.svg',
        link: '',
        contentType: 'link'
    },
    {
        title: 'ITEM-2',
        subtitle: 'SUB-2',
        icon: '../../res/core/assets/collections.svg',
        link: '',
        contentType: 'link'
    }
];

const GuideConfigs = {
    collmenu: collmenuGuides,

    getGuides(pageName) {
        return this[pageName] || [];
    }
};