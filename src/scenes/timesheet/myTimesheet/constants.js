let appConfig = require("../../../../appconfig");
export const dummyListData = [
    { title: "22-Mar-2021", items: [{ title: 'Node 1.1' }, { title: 'Node 1.2' }], dayType: "WD", isEditable: true, hoursRecorded: 2 },
    { title: "23-Mar-2021", items: [{ title: 'Node 1.1' }, { title: 'Node 1.2' }], dayType: "WD", isEditable: true, hoursRecorded: 4 },
    { title: "24-Mar-2021", items: [{ title: 'Node 1.1' }, { title: 'Node 1.2' }], dayType: "WD", isEditable: true, hoursRecorded: 8 },
    { title: "25-Mar-2021", items: [{ title: 'Node 1.1' }, { title: 'Node 1.2' }], dayType: "WD", isEditable: true, hoursRecorded: 8 },
    { title: "26-Mar-2021", items: [{ title: 'Node 1.1' }, { title: 'Node 1.2' }], dayType: "WD", isEditable: true, hoursRecorded: 6 },
    { title: "27-Mar-2021", items: [{ title: 'Node 1.1' }, { title: 'Node 1.2' }], dayType: "WO", isEditable: false, hoursRecorded: 0 },
    { title: "28-Mar-2021", items: [{ title: 'Node 1.1' }, { title: 'Node 1.2' }], dayType: "WO", isEditable: false, hoursRecorded: 0 },
    { title: "29-Mar-2021", items: [{ title: 'Node 1.1' }, { title: 'Node 1.2' }], dayType: "HD", isEditable: false, hoursRecorded: 0 },
    { title: "30-Mar-2021", items: [{ title: 'Node 1.1' }, { title: 'Node 1.2' }], dayType: "WD", isEditable: true, hoursRecorded: 4 },
    { title: "31-Mar-2021", items: [{ title: 'Node 1.1' }, { title: 'Node 1.2' }], dayType: "FDL", isEditable: false, hoursRecorded: 4 }
]

export const dummyListData3 = [
    {
        title: "1-Apr-2021", day: "Thu", items: [{ title: 'Node 1.1' }, { title: 'Node 1.2' }],
        dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 8
    },
    {
        title: "2-Apr-2021", day: "Fri", items: [{ title: 'Node 1.1' }, { title: 'Node 1.2' }],
        dayType: "HD", color: appConfig.HOLIDAY_COLOR, isEditable: false, hoursRecorded: 0
    },
    {
        title: "3-Apr-2021", day: "Sat", items: [{ title: 'Node 1.1' }, { title: 'Node 1.2' }],
        dayType: "WO", color: appConfig.WEEKLY_OFF_COLOR, isEditable: false, hoursRecorded: 0
    },
    {
        title: "4-Apr-2021", day: "Sun", items: [{ title: 'Node 1.1' }, { title: 'Node 1.2' }],
        dayType: "WO", color: appConfig.WEEKLY_OFF_COLOR, isEditable: false, hoursRecorded: 0
    },
    {
        title: "5-Apr-2021", day: "Mon", items: [{ title: 'Node 1.1' }, { title: 'Node 1.2' }],
        dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 2
    },
    {
        title: "6-Apr-2021", day: "Tue", items: [{ title: 'Node 1.1' }, { title: 'Node 1.2' }],
        dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 0
    },
    {
        title: "7-Apr-2021", day: "Wed", items: [{ title: 'Node 1.1' }, { title: 'Node 1.2' }],
        dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 0
    },
]

export const dummyListData4 = [
    { title: "08-Jun-2021", day: "Tue", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 8 },
    { title: "09-Jun-2021", day: "Wed", dayType: "HD", color: appConfig.WORK_DAY_COLOR, isEditable: false, hoursRecorded: 8 },
    { title: "10-Jun-2021", day: "Thu", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 4 },
    { title: "11-Jun-2021", day: "Fri", dayType: "HD", color: appConfig.WORK_DAY_COLOR, isEditable: false, hoursRecorded: 0 },
    { title: "12-Jun-2021", day: "Sat", dayType: "WO", color: appConfig.WEEKLY_OFF_COLOR, isEditable: true, hoursRecorded: 2 },
    { title: "13-Jun-2021", day: "Sun", dayType: "WO", color: appConfig.WEEKLY_OFF_COLOR, isEditable: false, hoursRecorded: 0 },
    { title: "14-Jun-2021", day: "Mon", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: false, hoursRecorded: 0 },
]

export const dummyListData2 = [{ //save or submit api data
    isSlotSubmit: '#false',
    slotId: '#SlotId',
    // projectListData: [],
    // activityListData: [],
    // categoryListData: [],
    //other properties...
    slotData: [
        {
            title: "22-Mar-2021",
            remarks: 'abcd',
            totalHours: '#8',
            items: [
                {
                    title: '#record1',
                    projectId: '#projectId',
                    projectText: '#projectText',
                    activeId: '#dummyId',
                    activityText: '#activityText',
                    categoryId: '#categoryId',
                    categoryText: '#categoryText',
                    hours: '#4',
                },
                {
                    title: '#record2',
                    projectId: '#projectId',
                    projectText: '#projectText',
                    activeId: '#dummyId',
                    activityText: '#activityText',
                    categoryId: '#categoryId',
                    categoryText: '#categoryText',
                    hours: '#2',
                },
                {
                    title: '#record3',
                    projectId: '#projectId',
                    projectText: '#projectText',
                    activeId: '#dummyId',
                    activityText: '#activityText',
                    categoryId: '#categoryId',
                    categoryText: '#categoryText',
                    hours: '#2',
                },
            ]
        },
        {
            title: "23-Mar-2021", remarks: 'abcd1', items: [{

            }]
        },
        {
            title: "24-Mar-2021", remarks: 'abcd2', items: [{

            }]
        },
        {
            title: "25-Mar-2021", remarks: 'abcd3', items: [{

            }]
        },
        {
            title: "26-Mar-2021", remarks: 'abcd4', items: [{

            }]
        },
        {
            title: "27-Mar-2021", remarks: 'abcd5', items: [{

            }]
        },
        {
            title: "28-Mar-2021", remarks: 'abcd6', items: [{

            }]
        },
        {
            title: "29-Mar-2021", remarks: 'abcd7', items: [{

            }]
        },
        {
            title: "30-Mar-2021", remarks: 'abcd8', items: [{

            }]
        },
        {
            title: "31-Mar-2021", remarks: 'abcd9', items: [{

            }]
        }
    ],
}]

export const dummyListData1 = [
    {
        title: "node1",
        data: [
            { title: "01-Apr-21", day: "Thu", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 8 },
            { title: "02-Apr-21", day: "Fri", dayType: "HD", color: appConfig.HOLIDAY_COLOR, isEditable: false, hoursRecorded: 0 },
            { title: "03-Apr-21", day: "Sat", dayType: "WO", color: appConfig.WEEKLY_OFF_COLOR, isEditable: false, hoursRecorded: 0 },
            { title: "04-Apr-21", day: "Sun", dayType: "WO", color: appConfig.WEEKLY_OFF_COLOR, isEditable: false, hoursRecorded: 0 },
            { title: "05-Apr-21", day: "Mon", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 2 },
            { title: "06-Apr-21", day: "Tue", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 4 },
            { title: "07-Apr-21", day: "Wed", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 0 }
        ]
    },
    {
        title: "node2",
        data: [
            { title: "01-Apr-21", day: "Thu", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 8 },
            { title: "02-Apr-21", day: "Fri", dayType: "HD", color: appConfig.HOLIDAY_COLOR, isEditable: false, hoursRecorded: 0 },
            { title: "03-Apr-21", day: "Sat", dayType: "WO", color: appConfig.WEEKLY_OFF_COLOR, isEditable: false, hoursRecorded: 0 },
            { title: "04-Apr-21", day: "Sun", dayType: "WO", color: appConfig.WEEKLY_OFF_COLOR, isEditable: false, hoursRecorded: 0 },
            { title: "05-Apr-21", day: "Mon", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 2 },
            { title: "06-Apr-21", day: "Tue", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 4 },
            { title: "07-Apr-21", day: "Wed", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 0 }]
    },
    {
        title: "node3",
        data: [
            { title: "01-Apr-21", day: "Thu", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 8 },
            { title: "02-Apr-21", day: "Fri", dayType: "HD", color: appConfig.HOLIDAY_COLOR, isEditable: false, hoursRecorded: 0 },
            { title: "03-Apr-21", day: "Sat", dayType: "WO", color: appConfig.WEEKLY_OFF_COLOR, isEditable: false, hoursRecorded: 0 },
            { title: "04-Apr-21", day: "Sun", dayType: "WO", color: appConfig.WEEKLY_OFF_COLOR, isEditable: false, hoursRecorded: 0 },
            { title: "05-Apr-21", day: "Mon", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 2 },
            { title: "06-Apr-21", day: "Tue", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 4 },
            { title: "07-Apr-21", day: "Wed", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 0 }]
    },
    {
        title: "node4",
        data: [
            { title: "01-Apr-21", day: "Thu", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 8 },
            { title: "02-Apr-21", day: "Fri", dayType: "HD", color: appConfig.HOLIDAY_COLOR, isEditable: false, hoursRecorded: 0 },
            { title: "03-Apr-21", day: "Sat", dayType: "WO", color: appConfig.WEEKLY_OFF_COLOR, isEditable: false, hoursRecorded: 0 },
            { title: "04-Apr-21", day: "Sun", dayType: "WO", color: appConfig.WEEKLY_OFF_COLOR, isEditable: false, hoursRecorded: 0 },
            { title: "05-Apr-21", day: "Mon", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 2 },
            { title: "06-Apr-21", day: "Tue", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 4 },
            { title: "07-Apr-21", day: "Wed", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 0 }]
    },
    {
        title: "node5",
        data: [
            { title: "01-Apr-21", day: "Thu", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 8 },
            { title: "02-Apr-21", day: "Fri", dayType: "HD", color: appConfig.HOLIDAY_COLOR, isEditable: false, hoursRecorded: 0 },
            { title: "03-Apr-21", day: "Sat", dayType: "WO", color: appConfig.WEEKLY_OFF_COLOR, isEditable: false, hoursRecorded: 0 },
            { title: "04-Apr-21", day: "Sun", dayType: "WO", color: appConfig.WEEKLY_OFF_COLOR, isEditable: false, hoursRecorded: 0 },
            { title: "05-Apr-21", day: "Mon", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 2 },
            { title: "06-Apr-21", day: "Tue", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 4 },
            { title: "07-Apr-21", day: "Wed", dayType: "WD", color: appConfig.WORK_DAY_COLOR, isEditable: true, hoursRecorded: 0 }]
    },

]