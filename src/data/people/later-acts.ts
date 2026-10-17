import { en } from '../text'
import type { Person } from '../types'

/**
 * Acts 18–28 beyond the journey stops (Apollos, Paul’s arrest and trials) and the movements of Paul’s companions that only his letters record. Summaries are editorial paraphrases of the cited passage.
 */
export const laterActsPeople: Person[] = [
  // Companions of Paul
  {
    id: 'luke',
    name: en('Luke'),
    role: en('Physician and fellow worker of Paul'),
    summary: en(
      'Paul called him the beloved physician and named him among his fellow workers, and in 2 Timothy wrote that only Luke was with him. Acts never mentions Luke by name.',
    ),
    refs: ['COL 4:14', 'PHM 1:24', '2TI 4:11'],
    groups: ['paul-and-companions'],
    identityNote: en(
      'Tradition identifies Luke as the author of the Gospel of Luke and of Acts, and as the narrator who speaks of “we” in parts of Acts (from Acts 16:10). Neither book names its author.',
    ),
  },
  {
    id: 'titus',
    name: en('Titus'),
    role: en('Greek partner and fellow worker of Paul'),
    summary: en(
      'A Greek whom Paul took with him to Jerusalem, where he was not compelled to be circumcised. Paul’s letters tell of him reaching Paul in Macedonia with news from the Corinthians, going to Corinth, and being left in Crete; Acts never names him.',
    ),
    refs: ['GAL 2:1-3', '2CO 7:6-7', '2CO 8:16-17', 'TIT 1:4-5', '2TI 4:10'],
    groups: ['paul-and-companions'],
  },
  {
    id: 'apollos',
    name: en('Apollos'),
    role: en('Eloquent Jewish teacher, an Alexandrian by birth'),
    summary: en(
      'An eloquent Jew, mighty in the Scriptures, who taught about Jesus at Ephesus knowing only John’s baptism until Priscilla and Aquila explained the way of God more accurately. He then went to Achaia and was at Corinth, where he helped the believers.',
    ),
    refs: ['ACT 18:24-28', 'ACT 19:1', '1CO 3:4-6', '1CO 16:12'],
    origins: [{ placeId: 'alexandria', ref: 'ACT 18:24' }],
    groups: ['early-church'],
  },
  {
    id: 'tychicus',
    name: en('Tychicus'),
    role: en('Companion from Asia and Paul’s messenger'),
    summary: en(
      'One of the seven who accompanied Paul as far as Asia after his months in Greece; Acts names him and Trophimus as men of Asia. Paul’s letters call him a beloved brother and faithful servant sent to bring news, and 2 Timothy says Paul sent him to Ephesus.',
    ),
    refs: ['ACT 20:4', 'EPH 6:21-22', 'COL 4:7-8', '2TI 4:12'],
    origins: [{ placeId: 'asia', ref: 'ACT 20:4' }],
    groups: ['paul-and-companions'],
  },
  {
    id: 'trophimus',
    name: en('Trophimus'),
    role: en('Companion of Paul from Ephesus'),
    summary: en(
      'One of the seven who accompanied Paul as far as Asia. In Jerusalem, Jews from Asia who had seen this Ephesian with Paul in the city supposed that Paul had brought him into the temple; 2 Timothy says Paul left him sick at Miletus.',
    ),
    refs: ['ACT 20:4', 'ACT 21:29', '2TI 4:20'],
    groups: ['paul-and-companions'],
    origins: [{ placeId: 'ephesus', ref: 'ACT 21:29' }, { placeId: 'asia', ref: 'ACT 20:4' }],
  },
  {
    id: 'erastus',
    name: en('Erastus'),
    role: en('Helper of Paul sent into Macedonia'),
    summary: en(
      'One of those who served Paul; Paul sent him and Timothy into Macedonia while he stayed in Asia. 2 Timothy says that Erastus remained at Corinth.',
    ),
    refs: ['ACT 19:22', '2TI 4:20'],
    groups: ['paul-and-companions'],
    identityNote: en(
      'The atlas treats the Erastus of Acts 19:22 and of 2 Timothy 4:20 as one person, the usual reading; the text does not say they are the same man. Romans 16:23 sends greetings from an Erastus, “the treasurer of the city,” whom the text does not identify with either.',
    ),
  },
  {
    id: 'sopater',
    name: en('Sopater'),
    role: en('Companion of Paul from Berea'),
    summary: en('Sopater of Beroea was one of the seven who accompanied Paul as far as Asia after his three months in Greece.'),
    refs: ['ACT 20:4'],
    groups: ['paul-and-companions'],
    origins: [{ placeId: 'berea', ref: 'ACT 20:4' }],
    identityNote: en(
      'Romans 16:21 sends greetings from a Sosipater, one of Paul’s relatives; whether he is the same man is uncertain.',
    ),
  },
  {
    id: 'secundus',
    name: en('Secundus'),
    role: en('Thessalonian companion of Paul'),
    summary: en(
      'Named with Aristarchus as being of the Thessalonians, among the seven who accompanied Paul as far as Asia.',
    ),
    refs: ['ACT 20:4'],
    groups: ['paul-and-companions'],
    origins: [{ placeId: 'thessalonica', ref: 'ACT 20:4' }],
  },
  {
    id: 'gaius-of-derbe',
    name: en('Gaius of Derbe'),
    searchTerms: ['Gaius'],
    role: en('Companion of Paul from Derbe'),
    summary: en('One of the seven who accompanied Paul as far as Asia after his three months in Greece.'),
    refs: ['ACT 20:4'],
    groups: ['paul-and-companions'],
    origins: [{ placeId: 'derbe', ref: 'ACT 20:4' }],
    identityNote: en(
      'Acts also names a Gaius of Macedonia, seized in the riot at Ephesus (19:29); the text does not identify the two, so they are listed separately. Paul’s letters also mention a Gaius among the Corinthians whom Paul baptized (1 Corinthians 1:14) and a Gaius who was Paul’s host (Romans 16:23); the text does not identify either with Gaius of Derbe.',
    ),
  },
  {
    id: 'gaius-of-macedonia',
    name: en('Gaius of Macedonia'),
    searchTerms: ['Gaius'],
    role: en('Macedonian traveling companion of Paul'),
    summary: en(
      'With Aristarchus, one of Paul’s Macedonian companions in travel whom the crowd seized as it rushed into the theater during the riot at Ephesus.',
    ),
    refs: ['ACT 19:29'],
    groups: ['paul-and-companions'],
    origins: [{ placeId: 'macedonia', ref: 'ACT 19:29' }],
    identityNote: en(
      'Acts also names a Gaius of Derbe among Paul’s companions (20:4); the text does not identify the two, so they are listed separately. Paul’s letters also mention a Gaius among the Corinthians whom Paul baptized (1 Corinthians 1:14) and a Gaius who was Paul’s host (Romans 16:23); the text does not identify either with this Gaius.',
    ),
  },
  {
    id: 'epaphroditus',
    name: en('Epaphroditus'),
    role: en('Sent by the Philippians to serve Paul'),
    summary: en(
      'Paul’s brother, fellow worker and fellow soldier, sent by the believers at Philippi to serve Paul’s needs. He brought their gifts and fell sick nearly to death, and Paul sent him back to them.',
    ),
    refs: ['PHP 2:25-30', 'PHP 4:18'],
    groups: ['paul-and-companions'],
  },
  {
    id: 'demas',
    name: en('Demas'),
    role: en('Fellow worker who later left Paul'),
    summary: en(
      'Named by Paul among his fellow workers who sent greetings. 2 Timothy says Demas left Paul out of love for this present world and went to Thessalonica.',
    ),
    refs: ['COL 4:14', 'PHM 1:24', '2TI 4:10'],
    groups: ['paul-and-companions'],
  },

  // Believers named in Acts 13–28 and the letters
  {
    id: 'simeon-niger',
    name: en('Simeon called Niger'),
    alternateNames: ['Niger'],
    searchTerms: ['Simeon'],
    role: en('One of the prophets and teachers at Antioch'),
    summary: en(
      'Named among the prophets and teachers of the assembly at Antioch when Barnabas and Saul were set apart and sent out.',
    ),
    refs: ['ACT 13:1-3'],
    groups: ['early-church'],
  },
  {
    id: 'lucius-of-cyrene',
    name: en('Lucius of Cyrene'),
    searchTerms: ['Lucius'],
    role: en('One of the prophets and teachers at Antioch'),
    summary: en(
      'Named among the prophets and teachers of the assembly at Antioch when Barnabas and Saul were set apart and sent out.',
    ),
    refs: ['ACT 13:1-3'],
    origins: [{ placeId: 'cyrene', ref: 'ACT 13:1' }],
    groups: ['early-church'],
    identityNote: en(
      'Romans 16:21 sends greetings from a Lucius, one of Paul’s relatives; the text does not identify him with Lucius of Cyrene.',
    ),
  },
  {
    id: 'manaen',
    name: en('Manaen'),
    role: en('One of the prophets and teachers at Antioch'),
    summary: en(
      'Described as the foster brother of Herod the tetrarch, he was named among the prophets and teachers of the assembly at Antioch when Barnabas and Saul were set apart and sent out.',
    ),
    refs: ['ACT 13:1-3'],
    groups: ['early-church'],
  },
  {
    id: 'justus-of-corinth',
    name: en('Justus of Corinth'),
    alternateNames: ['Justus'],
    searchTerms: ['Titius Justus', 'Titus Justus'],
    role: en('Worshiper of God whose house adjoined the synagogue'),
    summary: en(
      'A man who worshiped God, whose house in Corinth was next door to the synagogue. When the synagogue opposed Paul, he left it and went into Justus’ house.',
    ),
    refs: ['ACT 18:7'],
    groups: ['acts-figures'],
    identityNote: en(
      'The WEB calls him Justus. Some manuscripts, followed by many modern translations, call him Titius Justus.',
    ),
  },
  {
    id: 'mnason',
    name: en('Mnason'),
    role: en('Early disciple of Cyprus'),
    summary: en(
      'An early disciple of Cyprus. Disciples from Caesarea who went up to Jerusalem with Paul’s company brought him with them, and the travelers were to stay with him.',
    ),
    refs: ['ACT 21:16'],
    origins: [{ placeId: 'cyprus', ref: 'ACT 21:16' }],
    groups: ['early-church'],
  },
  {
    id: 'phoebe',
    name: en('Phoebe'),
    role: en('Servant of the assembly at Cenchreae'),
    summary: en(
      'Paul commended her as a servant of the assembly at Cenchreae and a helper of many, including himself, and asked the believers to whom he wrote to receive and assist her.',
    ),
    refs: ['ROM 16:1-2'],
    groups: ['women', 'early-church'],
  },

  // Paul's arrest and trials (Acts 21–26)
  {
    id: 'claudius-lysias',
    name: en('Claudius Lysias'),
    alternateNames: ['Lysias'],
    searchTerms: ['commanding officer', 'chief captain', 'tribune'],
    role: en('Roman commanding officer in Jerusalem'),
    summary: en(
      'The commanding officer of the regiment in Jerusalem, who arrested Paul during the uproar at the temple, brought him before the council and sent him under guard to Felix at Caesarea.',
    ),
    refs: ['ACT 21:31-33', 'ACT 22:24-29', 'ACT 23:26-30', 'ACT 24:22'],
    groups: ['authorities'],
    identityNote: en(
      'Acts calls him only the commanding officer until his letter to Felix, which begins “Claudius Lysias to the most excellent governor Felix” and recounts how he rescued Paul (Acts 23:26–27).',
    ),
  },
  {
    id: 'ananias-high-priest',
    name: en('Ananias the high priest'),
    searchTerms: ['Ananias', 'high priest'],
    role: en('High priest at Paul’s hearing and trial'),
    summary: en(
      'As high priest he commanded that Paul be struck on the mouth when Paul stood before the council. Later he came down to Caesarea with some elders and the orator Tertullus to accuse Paul before Felix.',
    ),
    refs: ['ACT 23:2-5', 'ACT 24:1'],
    groups: ['authorities'],
    identityNote: en('A different man from Ananias of Damascus and from Ananias the husband of Sapphira.'),
  },
  {
    id: 'tertullus',
    name: en('Tertullus'),
    role: en('Orator who accused Paul before Felix'),
    summary: en(
      'An orator who came down to Caesarea with the high priest Ananias and some elders and presented the case against Paul before the governor Felix.',
    ),
    refs: ['ACT 24:1-8'],
    groups: ['acts-figures'],
  },
  {
    id: 'felix',
    name: en('Felix'),
    role: en('Roman governor at Caesarea'),
    summary: en(
      'The governor to whom Paul was sent from Jerusalem. He heard Paul’s defense and put off a decision, later heard Paul with his wife Drusilla, and left Paul in bonds when Porcius Festus succeeded him two years later.',
    ),
    refs: ['ACT 23:24', 'ACT 24:10', 'ACT 24:22-27'],
    groups: ['authorities'],
  },
  {
    id: 'drusilla',
    name: en('Drusilla'),
    role: en('Wife of the governor Felix'),
    summary: en(
      'Felix’s wife, who was Jewish. She came with him when he sent for Paul and heard him speak about faith in Christ Jesus.',
    ),
    refs: ['ACT 24:24'],
    groups: ['women', 'acts-figures'],
  },
  {
    id: 'festus',
    name: en('Festus'),
    alternateNames: ['Porcius Festus'],
    role: en('Roman governor who succeeded Felix'),
    summary: en(
      'Succeeded Felix as governor and went up to Jerusalem, where the Jewish leaders asked him to bring Paul there. At Caesarea he heard Paul, who appealed to Caesar, and he brought Paul before King Agrippa while preparing to send him to Caesar.',
    ),
    refs: ['ACT 24:27', 'ACT 25:1-12', 'ACT 26:24-25'],
    groups: ['authorities'],
  },
  {
    id: 'agrippa-ii',
    name: en('King Agrippa'),
    alternateNames: ['Agrippa'],
    searchTerms: ['Agrippa II', 'Herod Agrippa II'],
    role: en('King who heard Paul’s defense at Caesarea'),
    summary: en(
      'Came to Caesarea with Bernice to greet Festus and asked to hear Paul himself. After Paul’s defense he told Festus that Paul might have been set free if he had not appealed to Caesar.',
    ),
    refs: ['ACT 25:13', 'ACT 25:22', 'ACT 26:1-3', 'ACT 26:27-32'],
    groups: ['authorities'],
    identityNote: en(
      'Acts calls him only King Agrippa. Historians, drawing on sources outside the Bible, identify him as Herod Agrippa II.',
    ),
  },
  {
    id: 'bernice',
    name: en('Bernice'),
    role: en('Came to Caesarea with King Agrippa'),
    summary: en(
      'Arrived at Caesarea with King Agrippa to greet Festus. She entered the place of hearing with Agrippa with great pomp and was present for Paul’s defense.',
    ),
    refs: ['ACT 25:13', 'ACT 25:23', 'ACT 26:30'],
    groups: ['women', 'acts-figures'],
    identityNote: en(
      'Acts does not say how she was related to Agrippa; sources outside the Bible describe her as his sister.',
    ),
  },
  {
    id: 'pauls-nephew',
    name: en('Paul’s nephew'),
    searchTerms: ['Paul’s sister’s son', 'nephew'],
    role: en('Son of Paul’s sister'),
    summary: en(
      'Heard of the plot to ambush Paul, went into the barracks and told him, and then told the commanding officer, who charged him to tell no one. Acts does not give his name.',
    ),
    refs: ['ACT 23:16-22'],
    groups: ['acts-figures'],
  },
]
