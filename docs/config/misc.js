const miscGuides = [
    {
        title: 'Example',
        subtitle: 'Link',
        icon: '../res/icons/sparkle.ico',
        link: 'https://www.justkaarlo.com/res/icons/sparkle.ico',
        contentType: 'link'
    },
    {
        title: 'Example',
        subtitle: 'Description',
        icon: '../res/icons/sparkle.ico',
        contentType: 'description',
        showTOC: false,
        description: `
            <p>Hello World</p>
        `,
    },
    {
        type: 'category',
        title: 'Games',
        subtitle: 'Resources',
        icon: 'https://www.justkaarlo.com/res/core/icons/console-controller.png',
        collapsed: false,
        guides: [
            {
                title: 'Broken Arrow',
                subtitle: '<b><span class="text-brokenArrow-roadmap">ROADMAP</span></b>',
                gridImage: 'https://clan.akamai.steamstatic.com/images//40513072/54feafa1577efdbb0304a981bb4284f0f8e22884.png',
                image: 'https://clan.akamai.steamstatic.com/images//40513072/54feafa1577efdbb0304a981bb4284f0f8e22884.png',
                link: 'https://store.steampowered.com/news/app/1604270/view/690900570100204077',
                contentType: 'image'
            },
        ]
    },
];