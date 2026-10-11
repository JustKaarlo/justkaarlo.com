(function initializeDS2FileList() {
    const apiKey = "__API_KEY__";
    const ds2RootFolderId = "12jPA8Wk6q0vJE3ysZVbzqsnkmlv36pRp";
    const ds2Container = document.getElementById("fileList");
    // CUSTOM CONSTANTS

    if (!ds2Container) {
        console.error("file list container not found");
        return;
    }

    listFilesInFolder({
        folderId: ds2RootFolderId,
        container: ds2Container,
        apiKey,
        enableSearch: false,
        iconDefinitions: {},
        iconAssignments: {},
        folderIconDefinitions: {},
        folderIconAssignments: {},
        highlightFiles: [],
        colorizeFiles: [],
        excludePartsFolders: [],
        folderGradientFallback: {},
        showDownloadButtonForAllFiles: false,
        downloadButtonFiles: [],
        excludeDownloadFiles: [
            "work-in-progress"
        ],
        customDownloadLinks: {},
        customWebsiteLinks: {
            "custom-file-1": "https://www.nexusmods.com/darksouls2/mods/1468",
            "custom-file-2": "https://www.nexusmods.com/darksouls2/mods/1327"
        },
        tooltipData: {
            "custom-file-1": {
                description: "Overhaul to the co-operative aspect of Dark Souls II: Scholar of the First Sin's multiplayer",
                images: [
                    "https://staticdelivery.nexusmods.com/mods/482/images/1468/1468-1786908587-1901769252.jpg",
                ]
            },
            "custom-file-2": {
                description: "A QoL Overhaul mod that aims at giving a new life to Dark Souls 2 by changing some of the most annoying features of the game, such as the animations, the durability, the adaptability and much much more!",
                images: [
                    "https://staticdelivery.nexusmods.com/mods/482/images/1327/1327-1728848009-848632161.png",
                ]
            },
        },
        showDownloadButtonAtRoot: true,
        customDisplayNames: {},
        tagDefinitions: {},
        tagAssignments: {},
        hideAllSizeTags: false,
        hideSizeTagFiles: [
            "custom-file-1",
            "custom-file-2"
        ],
        hideSizeTagFolders: [],
        customFiles: [
            {
                id: "custom-file-1",
                name: "Seamless Co-op",
                mimeType: "application/zip",
                size: "0",
                icon: "../../res/icons/nexus-mods.ico",
                downloadUrl: "https://www.nexusmods.com/darksouls2/mods/1468?tab=files",
                url: "https://www.nexusmods.com/darksouls2/mods/1468"
            },
            {
                id: "custom-file-2",
                name: "Modern Dark Souls 2 Experience",
                mimeType: "application/zip",
                size: "0",
                icon: "../../res/icons/nexus-mods.ico",
                downloadUrl: "https://www.nexusmods.com/darksouls2/mods/1327?tab=files",
                url: "https://www.nexusmods.com/darksouls2/mods/1327"
            },
            {
                id: "work-in-progress",
                name: "Work In Progress",
                mimeType: "application/zip",
                icon: "null",
            },
        ],
        customFolders: [],
    });
    attachDocPreview(ds2Container);
})()