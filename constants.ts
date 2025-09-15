import { Subject, Chapter, Grade } from './types';

export const SUBJECTS: Subject[] = [
    Subject.History,
    Subject.Geography,
    Subject.Civics,
    Subject.Economics,
];

// FIX: The 'Grade' type was used here without being imported.
export const CHAPTERS: Record<Grade, Record<Subject, Chapter[]>> = {
    9: {
        [Subject.History]: [
            { id: 'c9h1', title: 'The French Revolution' },
            { id: 'c9h2', title: 'Socialism in Europe and the Russian Revolution' },
            { id: 'c9h3', title: 'Nazism and the Rise of Hitler' },
            { id: 'c9h4', title: 'Forest Society and Colonialism' },
            { id: 'c9h5', title: 'Pastoralists in the Modern World' },
        ],
        [Subject.Geography]: [
            { id: 'c9g1', title: 'India - Size and Location' },
            { id: 'c9g2', title: 'Physical Features of India' },
            { id: 'c9g3', title: 'Drainage' },
            { id: 'c9g4', title: 'Climate' },
            { id: 'c9g5', title: 'Natural Vegetation and Wildlife' },
            { id: 'c9g6', title: 'Population' },
        ],
        [Subject.Civics]: [
            { id: 'c9c1', title: 'What is Democracy? Why Democracy?' },
            { id: 'c9c2', title: 'Constitutional Design' },
            { id: 'c9c3', title: 'Electoral Politics' },
            { id: 'c9c4', title: 'Working of Institutions' },
            { id: 'c9c5', title: 'Democratic Rights' },
        ],
        [Subject.Economics]: [
            { id: 'c9e1', title: 'The Story of Village Palampur' },
            { id: 'c9e2', title: 'People as Resource' },
            { id: 'c9e3', title: 'Poverty as a Challenge' },
            { id: 'c9e4', title: 'Food Security in India' },
        ]
    },
    10: {
        [Subject.History]: [
            { id: 'c10h1', title: 'The Rise of Nationalism in Europe' },
            { id: 'c10h2', title: 'Nationalism in India' },
            { id: 'c10h3', title: 'The Making of a Global World' },
            { id: 'c10h4', title: 'The Age of Industrialisation' },
            { id: 'c10h5', title: 'Print Culture and the Modern World' },
        ],
        [Subject.Geography]: [
            { id: 'c10g1', title: 'Resources and Development' },
            { id: 'c10g2', title: 'Forest and Wildlife Resources' },
            { id: 'c10g3', title: 'Water Resources' },
            { id: 'c10g4', title: 'Agriculture' },
            { id: 'c10g5', title: 'Minerals and Energy Resources' },
            { id: 'c10g6', title: 'Manufacturing Industries' },
            { id: 'c10g7', title: 'Lifelines of National Economy' },
        ],
        [Subject.Civics]: [
            { id: 'c10c1', title: 'Power Sharing' },
            { id: 'c10c2', title: 'Federalism' },
            { id: 'c10c3', title: 'Gender, Religion and Caste' },
            { id: 'c10c4', title: 'Political Parties' },
            { id: 'c10c5', title: 'Outcomes of Democracy' },
        ],
        [Subject.Economics]: [
            { id: 'c10e1', title: 'Development' },
            { id: 'c10e2', title: 'Sectors of the Indian Economy' },
            { id: 'c10e3', title: 'Money and Credit' },
            { id: 'c10e4', title: 'Globalisation and the Indian Economy' },
            { id: 'c10e5', title: 'Consumer Rights' },
        ]
    }
};

export const SYLLABUS_YEAR = '2025-2026';