const test = [
    // {
    //     title: 'Miscellaneous',
    //     subtitle: 'Documentation',
    //     icon: '../res/icons/sparkle.ico',
    //     link: 'https://www.justkaarlo.com/docs/misc',
    //     contentType: 'link'
    // },
    // // { // ACE
    // //     type: 'section',
    // //     title: 'ACE',
    // //     subtitle: '━━━━━━━'
    // // },
    // {
    //     type: 'category',
    //     title: 'Games',
    //     subtitle: 'Documentation for Games',
    //     icon: '',
    //     collapsed: true,
    //     guides: [
    //         {
    //             title: 'ArmA3',
    //             subtitle: 'Documentation',
    //             icon: 'https://www.justkaarlo.com/res/icons/arma3.ico',
    //             link: 'https://www.justkaarlo.com/docs/arma3',
    //             contentType: 'link'
    //         },
    //         {
    //             title: 'Gray Zone Warfare',
    //             subtitle: 'Documentation',
    //             icon: 'https://www.justkaarlo.com/res/icons/grayzone.ico',
    //             link: 'https://www.justkaarlo.com/docs/grayzone',
    //             contentType: 'link'
    //         },
    //     ]
    // },
];

const GuideConfigs = {
    main: guides,

    getGuides(pageName) {
        return this[pageName] || [];
    }
};