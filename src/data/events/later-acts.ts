import { en } from '../text'
import type { BiblicalEvent } from '../types'

/**
 * Acts 18–28 beyond the journey stops (Apollos, Paul’s arrest and trials) and the movements of Paul’s companions that only his letters record. Summaries are editorial paraphrases of the cited passage.
 */
export const laterActsEvents: BiblicalEvent[] = [
  // Apollos — Acts 18:24–19:1
  {
    id: 'apollos-at-ephesus',
    title: en('Apollos at Ephesus'),
    summary: en(
      'Apollos, an Alexandrian Jew who was eloquent and mighty in the Scriptures, came to Ephesus and taught accurately about Jesus, though he knew only John’s baptism. When Priscilla and Aquila heard him speak boldly in the synagogue, they took him aside and explained the way of God to him more accurately.',
    ),
    placeIds: ['ephesus'],
    personIds: ['apollos', 'priscilla', 'aquila'],
    passage: 'ACT 18:24-26',
    excerpt: 'ACT 18:25-26',
    tags: ['apollos', 'teaching', 'synagogue', 'baptism of john'],
  },
  {
    id: 'apollos-at-corinth',
    title: en('Apollos at Corinth'),
    summary: en(
      'When Apollos decided to cross over to Achaia, the brothers encouraged him and wrote to the disciples to receive him. In Achaia he greatly helped those who had believed, powerfully refuting the Jews in public and showing from the Scriptures that Jesus was the Christ.',
    ),
    placeIds: ['corinth'],
    locationNote: en('Acts 18:27 says Apollos crossed into Achaia; Acts 19:1 says he was at Corinth.'),
    personIds: ['apollos'],
    passage: 'ACT 18:27-19:1',
    relatedRefs: ['1CO 3:4-6'],
    tags: ['apollos', 'achaia', 'scriptures', 'debate'],
  },

  // Ephesus — Acts 19:21–22
  {
    id: 'timothy-and-erastus-sent',
    title: en('Timothy and Erastus are sent to Macedonia'),
    summary: en(
      'Paul resolved in the Spirit to pass through Macedonia and Achaia and go to Jerusalem, saying that afterward he must also see Rome. He sent two of those who served him, Timothy and Erastus, into Macedonia, while he himself stayed in Asia for a while.',
    ),
    placeIds: ['ephesus', 'macedonia'],
    locationNote: en(
      'Acts says Paul stayed “in Asia”; the surrounding narrative places him at Ephesus (Acts 19:1, 19:17). Acts names only the region Timothy and Erastus were sent to.',
    ),
    personIds: ['paul', 'timothy', 'erastus'],
    passage: 'ACT 19:21-22',
    tags: ['timothy', 'erastus', 'macedonia', 'plans', 'rome'],
  },

  // Arrest in Jerusalem — Acts 21:18–23:30
  {
    id: 'paul-meets-james',
    title: en('Paul reports to James and the elders'),
    summary: en(
      'The next day Paul reported to James and all the elders what God had done among the Gentiles. Because believers zealous for the law had heard that he taught Jews among the Gentiles to forsake Moses, they urged him to purify himself with four men under a vow, and he went into the temple with them.',
    ),
    placeIds: ['jerusalem'],
    personIds: ['paul', 'james-brother-of-jesus'],
    passage: 'ACT 21:18-26',
    excerpt: 'ACT 21:18-20',
    tags: ['james', 'elders', 'vow', 'purification', 'temple'],
  },
  {
    id: 'paul-seized-in-the-temple',
    title: en('Paul is seized in the temple'),
    summary: en(
      'Near the end of the seven days, Jews from Asia saw Paul in the temple and stirred up the crowd, claiming he had brought Greeks into it, since they had seen Trophimus the Ephesian with him in the city. The crowd dragged Paul out to kill him, but the commanding officer came with soldiers and arrested him.',
    ),
    placeIds: ['temple-mount', 'jerusalem'],
    locationNote: en(
      'Paul was seized in the temple and dragged out of it; the commanding officer arrested him outside and ordered him taken to the barracks (Acts 21:30–34). Trophimus is mentioned only as someone seen with Paul in the city.',
    ),
    personIds: ['paul', 'claudius-lysias'],
    passage: 'ACT 21:27-36',
    excerpt: 'ACT 21:27-30',
    tags: ['arrest', 'temple', 'riot', 'trophimus', 'soldiers'],
  },
  {
    id: 'defense-on-the-stairs',
    title: en('Paul’s defense on the stairs'),
    summary: en(
      'With the commanding officer’s permission, Paul spoke to the crowd in Hebrew, telling how he had persecuted the Way until Jesus spoke to him near Damascus. When he spoke of being sent to the Gentiles, the crowd called for his death. About to be scourged, he said he was a Roman, and the examiners withdrew.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en(
      'Acts places the speech on the stairs as Paul was about to be brought into the barracks (Acts 21:35–40); it does not locate the barracks further.',
    ),
    personIds: ['paul', 'claudius-lysias'],
    passage: 'ACT 21:37-22:29',
    excerpt: 'ACT 21:39-22:3',
    tags: ['defense', 'speech', 'hebrew', 'roman citizen', 'conversion account'],
  },
  {
    id: 'paul-before-the-council',
    title: en('Paul before the council'),
    summary: en(
      'The commanding officer set Paul before the chief priests and the council, and the high priest Ananias ordered him struck on the mouth. When Paul cried out that he was a Pharisee on trial concerning the resurrection of the dead, Pharisees and Sadducees fell into dispute, and soldiers took him back to the barracks by force.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en('Acts does not say where in Jerusalem the council met.'),
    personIds: ['paul', 'claudius-lysias', 'ananias-high-priest'],
    passage: 'ACT 22:30-23:10',
    excerpt: 'ACT 23:6-10',
    tags: ['council', 'sanhedrin', 'high priest', 'pharisees', 'sadducees', 'resurrection'],
  },
  {
    id: 'the-lord-stands-by-paul',
    title: en('The Lord stands by Paul'),
    summary: en(
      'The following night the Lord stood by Paul and told him to take courage: as he had testified in Jerusalem, so he must testify also in Rome.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en('Acts does not say where Paul was that night; he had just been taken back into the barracks (Acts 23:10).'),
    personIds: ['paul'],
    passage: 'ACT 23:11',
    tags: ['vision', 'night', 'encouragement', 'rome'],
  },
  {
    id: 'plot-against-paul',
    title: en('The plot and Paul’s nephew'),
    summary: en(
      'More than forty men swore not to eat or drink until they had killed Paul and planned an ambush. Paul’s nephew heard of it and told Paul and then the commanding officer, who ordered a large guard to take Paul to Felix the governor by night and wrote Felix a letter about the case.',
    ),
    placeIds: ['jerusalem'],
    personIds: ['paul', 'pauls-nephew', 'claudius-lysias'],
    passage: 'ACT 23:12-30',
    excerpt: 'ACT 23:16-22',
    tags: ['plot', 'ambush', 'nephew', 'oath', 'letter'],
  },

  // Custody at Caesarea — Acts 23:31–26:32
  {
    id: 'night-ride-to-antipatris',
    title: en('By night to Antipatris'),
    summary: en(
      'Following their orders, the soldiers brought Paul by night to Antipatris. The next day they returned to the barracks, leaving the horsemen to go on with him.',
    ),
    placeIds: ['antipatris'],
    personIds: ['paul'],
    passage: 'ACT 23:31-32',
    tags: ['night journey', 'escort', 'horsemen', 'soldiers'],
  },
  {
    id: 'delivered-to-felix',
    title: en('Delivered to Felix at Caesarea'),
    summary: en(
      'The horsemen reached Caesarea, delivered the letter to the governor and presented Paul to him. Learning that Paul was from Cilicia, Felix said he would hear him when his accusers arrived and ordered him kept in Herod’s palace.',
    ),
    placeIds: ['caesarea'],
    personIds: ['paul', 'felix'],
    passage: 'ACT 23:33-35',
    tags: ['governor', 'custody', 'prisoner', 'palace'],
  },
  {
    id: 'trial-before-felix',
    title: en('Trial before Felix'),
    summary: en(
      'The high priest Ananias came down with some elders and an orator, Tertullus, who accused Paul before Felix of stirring up insurrection and trying to profane the temple. Paul answered that he had gone up to Jerusalem to worship and to bring gifts to his nation. Felix put off the case and kept Paul in custody.',
    ),
    placeIds: ['caesarea'],
    personIds: ['paul', 'felix', 'ananias-high-priest', 'tertullus'],
    passage: 'ACT 24:1-23',
    excerpt: 'ACT 24:10-16',
    tags: ['trial', 'governor', 'accusation', 'defense'],
  },
  {
    id: 'felix-and-drusilla',
    title: en('Felix and Drusilla hear Paul'),
    summary: en(
      'Felix came with his wife Drusilla, who was Jewish, and heard Paul speak about faith in Christ Jesus; when Paul reasoned about righteousness, self-control and the judgment to come, Felix was terrified and sent him away. Hoping for money, Felix often talked with him, and when Festus succeeded him after two years, he left Paul in bonds.',
    ),
    placeIds: ['caesarea'],
    personIds: ['paul', 'felix', 'drusilla'],
    passage: 'ACT 24:24-27',
    tags: ['governor', 'judgment', 'two years', 'custody'],
  },
  {
    id: 'festus-in-jerusalem',
    title: en('Festus visits Jerusalem'),
    summary: en(
      'Three days after arriving in the province, Festus went up from Caesarea to Jerusalem. The high priest and the principal men of the Jews asked him to summon Paul to Jerusalem, planning to kill him on the way, but Festus said Paul would be kept at Caesarea and told them to come down and accuse him there.',
    ),
    placeIds: ['jerusalem'],
    personIds: ['festus'],
    passage: 'ACT 25:1-5',
    tags: ['governor', 'plot', 'high priest', 'ambush'],
  },
  {
    id: 'paul-appeals-to-caesar',
    title: en('Paul appeals to Caesar'),
    summary: en(
      'At Caesarea, Jews from Jerusalem brought many serious charges against Paul that they could not prove, and Paul denied any offense against the law, the temple or Caesar. When Festus asked whether he would go up to Jerusalem to be judged, Paul appealed to Caesar, and Festus said that to Caesar he would go.',
    ),
    placeIds: ['caesarea'],
    personIds: ['paul', 'festus'],
    passage: 'ACT 25:6-12',
    excerpt: 'ACT 25:9-12',
    tags: ['appeal to caesar', 'trial', 'judgment seat', 'governor'],
  },
  {
    id: 'paul-before-agrippa-and-bernice',
    title: en('Paul before Agrippa and Bernice'),
    summary: en(
      'King Agrippa and Bernice came to Caesarea, and Festus had Paul brought before them. Paul told of his former life, his persecution of believers and his vision on the road to Damascus. Afterward they agreed he had done nothing worthy of death or bonds, and Agrippa said he could have been freed had he not appealed to Caesar.',
    ),
    placeIds: ['caesarea'],
    personIds: ['paul', 'festus', 'agrippa-ii', 'bernice'],
    passage: 'ACT 25:13-26:32',
    excerpt: 'ACT 26:24-29',
    tags: ['king agrippa', 'bernice', 'defense', 'speech', 'appeal to caesar'],
  },

  // Timothy in Paul's letters
  {
    id: 'timothy-sent-to-thessalonica',
    title: en('Timothy sent to Thessalonica'),
    summary: en(
      'Paul wrote to the Thessalonians that when they could bear it no longer, “we thought it good to be left behind at Athens alone,” and sent Timothy to establish and comfort them in their faith amid afflictions. Timothy had since come back with good news of their faith and love.',
    ),
    placeIds: ['athens', 'thessalonica'],
    locationNote: en(
      '1 Thessalonians names Athens and is addressed to the assembly of the Thessalonians (1:1). It does not say where Timothy rejoined Paul, and Acts does not narrate this journey.',
    ),
    personIds: ['paul', 'timothy'],
    passage: '1TH 3:1-6',
    excerpt: '1TH 3:1-2',
    relatedRefs: ['ACT 17:15-16', 'ACT 18:5'],
    tags: ['timothy', 'letter', 'encouragement', 'affliction'],
  },
  {
    id: 'timothy-sent-to-corinth',
    title: en('Timothy sent to Corinth'),
    summary: en(
      'Writing to the assembly at Corinth, Paul said he had sent Timothy, his beloved and faithful child in the Lord, to remind them of his ways in Christ, as he taught everywhere in every assembly.',
    ),
    placeIds: ['ephesus', 'corinth'],
    locationNote: en(
      '1 Corinthians is addressed to the assembly at Corinth (1:2), and Paul writes that he will stay at Ephesus until Pentecost (16:8). The letter does not say that Timothy had arrived: “if Timothy comes” (16:10).',
    ),
    personIds: ['paul', 'timothy'],
    passage: '1CO 4:17',
    relatedRefs: ['1CO 16:8-11'],
    tags: ['timothy', 'letter', 'sent'],
  },
  {
    id: 'timothy-stays-at-ephesus',
    title: en('Timothy asked to stay at Ephesus'),
    summary: en(
      'Paul reminded Timothy that, when Paul was going into Macedonia, he had urged him to stay at Ephesus and command certain men not to teach a different doctrine.',
    ),
    placeIds: ['ephesus'],
    locationNote: en(
      '1 Timothy places Timothy at Ephesus but does not say where Paul was when he urged him, or when this happened.',
    ),
    personIds: ['timothy'],
    passage: '1TI 1:3',
    tags: ['timothy', 'teaching', 'letter'],
  },

  // Companions in 2 Timothy
  {
    id: 'only-luke-with-paul',
    title: en('Only Luke is with Paul'),
    summary: en(
      'Paul urged Timothy to come to him soon: Demas had left him and gone to Thessalonica, Crescens had gone to Galatia and Titus to Dalmatia, and only Luke was with him. He asked Timothy to bring Mark, who was useful to him for service.',
    ),
    placeIds: ['rome'],
    locationNote: en(
      '2 Timothy does not name the place of writing. Paul writes as a prisoner in chains (1:8; 2:9) and says Onesiphorus sought him diligently in Rome and found him (1:16–17); the event is mapped to Rome on that basis.',
    ),
    personIds: ['paul', 'luke'],
    passage: '2TI 4:9-11',
    relatedRefs: ['2TI 1:16-17', 'COL 4:14', 'PHM 1:24'],
    tags: ['luke', 'prisoner', 'letter', 'companions'],
  },
  {
    id: 'demas-goes-to-thessalonica',
    title: en('Demas goes to Thessalonica'),
    summary: en('Paul told Timothy that Demas had left him out of love for this present world and had gone to Thessalonica.'),
    placeIds: ['thessalonica'],
    locationNote: en('2 Timothy names only where Demas went.'),
    personIds: ['demas'],
    passage: '2TI 4:10',
    tags: ['demas', 'departure', 'letter'],
  },
  {
    id: 'tychicus-sent-to-ephesus',
    title: en('Tychicus sent to Ephesus'),
    summary: en('Paul told Timothy that he had sent Tychicus to Ephesus.'),
    placeIds: ['ephesus'],
    locationNote: en('2 Timothy names only where Tychicus was sent.'),
    personIds: ['tychicus'],
    passage: '2TI 4:12',
    tags: ['tychicus', 'sent', 'letter'],
  },
  {
    id: 'erastus-stays-at-corinth',
    title: en('Erastus remains at Corinth'),
    summary: en('Paul told Timothy that Erastus had remained at Corinth.'),
    placeIds: ['corinth'],
    personIds: ['erastus'],
    passage: '2TI 4:20',
    tags: ['erastus', 'companions', 'letter'],
  },
  {
    id: 'trophimus-left-at-miletus',
    title: en('Trophimus left sick at Miletus'),
    summary: en('Paul told Timothy that he had left Trophimus sick at Miletus.'),
    placeIds: ['miletus'],
    locationNote: en('2 Timothy does not say when this happened.'),
    personIds: ['paul', 'trophimus'],
    passage: '2TI 4:20',
    tags: ['trophimus', 'illness', 'letter'],
  },

  // Titus in Paul's letters
  {
    id: 'titus-goes-up-to-jerusalem',
    title: en('Titus goes up to Jerusalem'),
    summary: en(
      'After fourteen years Paul went up again to Jerusalem by revelation with Barnabas, taking Titus with him, and laid out the Good News he preached among the Gentiles, privately before those who were respected. Titus, a Greek, was not compelled to be circumcised.',
    ),
    placeIds: ['jerusalem'],
    personIds: ['paul', 'barnabas', 'titus'],
    passage: 'GAL 2:1-3',
    tags: ['titus', 'circumcision', 'gentiles', 'letter'],
  },
  {
    id: 'titus-reaches-paul-in-macedonia',
    title: en('Titus reaches Paul in Macedonia'),
    summary: en(
      'When Paul came into Macedonia he had no rest, with conflicts outside and fears within. God comforted him by the coming of Titus, who told him of the Corinthians’ longing, mourning and zeal for Paul.',
    ),
    placeIds: ['macedonia'],
    locationNote: en(
      '2 Corinthians names only the region. Earlier in the letter Paul says he went on from Troas into Macedonia because he did not find Titus there (2:12–13).',
    ),
    personIds: ['paul', 'titus'],
    passage: '2CO 7:5-7',
    relatedRefs: ['2CO 2:12-13', '2CO 7:13-15'],
    tags: ['titus', 'comfort', 'news', 'letter'],
  },
  {
    id: 'titus-goes-to-corinth',
    title: en('Titus goes to Corinth'),
    summary: en(
      'Paul wrote that God had given Titus the same earnest care for the Corinthians: Titus accepted Paul’s appeal and, being very earnest himself, went to them of his own accord. With him Paul sent a brother whose praise in the Good News was known throughout the assemblies.',
    ),
    placeIds: ['corinth'],
    locationNote: en(
      '2 Corinthians is addressed to the assembly at Corinth (1:1). The letter speaks of Titus going to the Corinthians but does not narrate his arrival.',
    ),
    personIds: ['titus'],
    passage: '2CO 8:16-18',
    relatedRefs: ['2CO 8:6', '2CO 8:23', '2CO 12:18'],
    tags: ['titus', 'gift', 'sent', 'letter'],
  },
  {
    id: 'titus-left-in-crete',
    title: en('Titus left in Crete'),
    summary: en(
      'Paul wrote to Titus that he had left him in Crete to set in order what was lacking and to appoint elders in every city, as Paul had directed him.',
    ),
    placeIds: ['crete'],
    locationNote: en(
      'The letter names only the island and does not say when this happened; Acts does not narrate a visit by Paul and Titus to Crete.',
    ),
    personIds: ['paul', 'titus'],
    passage: 'TIT 1:5',
    tags: ['titus', 'elders', 'letter'],
  },

  // Other companions in Paul's letters
  {
    id: 'epaphroditus-sent-to-philippi',
    title: en('Epaphroditus sent back to Philippi'),
    summary: en(
      'Paul wrote to the believers at Philippi that he was sending back Epaphroditus, his fellow worker, whom they had sent to serve his needs. Epaphroditus had longed for them and had been sick nearly to death, and Paul sent him so that they might rejoice to see him again.',
    ),
    placeIds: ['philippi'],
    locationNote: en(
      'Philippians is addressed to the saints at Philippi (1:1). Paul does not say where he was held when he wrote, so only Epaphroditus’ destination is mapped.',
    ),
    personIds: ['epaphroditus'],
    passage: 'PHP 2:25-30',
    relatedRefs: ['PHP 4:18'],
    tags: ['epaphroditus', 'illness', 'messenger', 'letter'],
  },
  {
    id: 'timothy-to-be-sent-to-philippi',
    title: en('Paul hopes to send Timothy to Philippi'),
    summary: en(
      'Paul and Timothy wrote together to the saints at Philippi. Paul told them he hoped to send Timothy to them soon, as soon as he saw how things would go with him, for Timothy had served with him in the Good News as a child serves a father.',
    ),
    placeIds: ['philippi'],
    locationNote: en(
      'Philippians is from Paul and Timothy to the saints at Philippi (1:1). Paul does not say where he was when he wrote, so only the city he wrote to is mapped.',
    ),
    personIds: ['paul', 'timothy'],
    passage: 'PHP 2:19-24',
    relatedRefs: ['PHP 1:1'],
    tags: ['timothy', 'philippians', 'letter'],
  },
  {
    id: 'phoebe-commended',
    title: en('Paul commends Phoebe'),
    summary: en(
      'Paul commended Phoebe, a servant of the assembly at Cenchreae, asking the believers to receive her in the Lord and help her in whatever she needed, for she had been a helper of many, including Paul.',
    ),
    placeIds: ['cenchreae'],
    locationNote: en(
      'Romans 16:1 connects Phoebe with the assembly at Cenchreae, where she is mapped. The letter is addressed to the believers in Rome (1:7) but does not say where it was written or describe her travels.',
    ),
    personIds: ['phoebe'],
    passage: 'ROM 16:1-2',
    tags: ['phoebe', 'women', 'commendation', 'letter'],
  },
]
