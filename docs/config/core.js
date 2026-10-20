const docs = [
    {
        title: 'Miscellaneous',
        subtitle: 'Documentation',
        icon: '../res/icons/sparkle.ico',
        link: 'https://www.justkaarlo.com/docs/misc',
        contentType: 'link'
    },
    // { // ACE
    //     type: 'section',
    //     title: 'ACE',
    //     subtitle: '━━━━━━━'
    // },
    {
        type: 'category',
        title: 'Games',
        subtitle: 'Documentation for Games',
        icon: '',
        collapsed: true,
        guides: [
            {
                title: 'ArmA3',
                subtitle: 'Documentation',
                icon: 'https://www.justkaarlo.com/res/icons/arma3.ico',
                link: 'https://www.justkaarlo.com/docs/arma3',
                contentType: 'link'
            },
            {
                title: 'Gray Zone Warfare',
                subtitle: 'Documentation',
                icon: 'https://www.justkaarlo.com/res/icons/grayzone.ico',
                link: 'https://www.justkaarlo.com/docs/grayzone',
                contentType: 'link'
            },
            // {
            //     title: 'Roblox',
            //     subtitle: 'Experiences List',
            //     icon: 'https://www.justkaarlo.com/res/icons/roblox-white.ico',
            //     link: 'https://www.justkaarlo.com/docs/roblox-experiences',
            //     contentType: 'link'
            // },
        ]
    },
];

const mods = [
    {
        title: 'Elden Ring',
        subtitle: 'Shared Mods',
        icon: 'https://www.justkaarlo.com/res/icons/eldenring.ico',
        link: 'https://www.justkaarlo.com/mods/elden-ring',
        contentType: 'link'
    },
    // {
    //     title: 'Dark Souls II',
    //     subtitle: 'Collection List',
    //     icon: 'https://www.justkaarlo.com/res/icons/darksouls2.ico',
    //     link: 'https://www.justkaarlo.com/mods/darksouls-2',
    //     contentType: 'link'
    // },
];

const GuideConfigs = {
    main: guides,
    arma3: arma3Guides,
    grayzone: gzwGuides,
    misc: miscGuides,
    mods: mods,
    docs: docs,

    getGuides(pageName) {
        return this[pageName] || [];
    }
};