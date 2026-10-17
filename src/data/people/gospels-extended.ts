import { en } from '../text'
import type { Person } from '../types'

/**
 * Further Gospel places, people and events: John the Baptist, the Twelve, the trials, the resurrection appearances. Each event cites one account; parallels are in relatedRefs.
 */
export const gospelsExtendedPeople: Person[] = [
  // The rest of the Twelve
  {
    id: 'philip-apostle',
    name: en('Philip the apostle'),
    searchTerms: ['Philip', 'Apostle Philip', 'Philip of Bethsaida'],
    role: en('One of the Twelve, from Bethsaida'),
    summary: en(
      'Named in every list of the Twelve. John says he was from Bethsaida, the city of Andrew and Peter, that Jesus told him to follow him, and that Greeks at the feast in Jerusalem came to Philip asking to see Jesus.',
    ),
    refs: ['MRK 3:18', 'JHN 1:43-44', 'JHN 6:5-7', 'JHN 12:21-22', 'ACT 1:13'],
    groups: ['jesus-and-the-twelve'],
    identityNote: en(
      'Acts distinguishes him from Philip the evangelist, one of the seven chosen at the request of the Twelve (Acts 6:2–5; 21:8).',
    ),
    origins: [{ placeId: 'bethsaida', ref: 'JHN 1:44' }],
  },
  {
    id: 'bartholomew',
    name: en('Bartholomew'),
    role: en('One of the Twelve'),
    summary: en('Named in each list of the Twelve; the Gospels and Acts record nothing else about him.'),
    refs: ['MAT 10:3', 'MRK 3:18', 'LUK 6:14', 'ACT 1:13'],
    groups: ['jesus-and-the-twelve'],
    identityNote: en(
      'Bartholomew appears only in the lists of the Twelve. Tradition sometimes identifies him with Nathanael, who appears only in John; the Gospels do not make this identification, and the atlas treats them as separate people.',
    ),
  },
  {
    id: 'thomas',
    name: en('Thomas'),
    alternateNames: ['Didymus'],
    role: en('One of the Twelve, called Didymus'),
    summary: en(
      'In John’s Gospel he urged his fellow disciples to go with Jesus, refused to believe their report of the risen Lord unless he could see and touch his wounds, and eight days later called Jesus his Lord and his God.',
    ),
    refs: ['MRK 3:18', 'JHN 11:16', 'JHN 14:5', 'JHN 20:24-29', 'JHN 21:2'],
    groups: ['jesus-and-the-twelve'],
  },
  {
    id: 'matthew',
    name: en('Matthew'),
    alternateNames: ['Levi'],
    role: en('Tax collector and one of the Twelve'),
    summary: en(
      'A tax collector whom Jesus called from the tax collection office; he got up and followed him. He is listed among the Twelve as Matthew the tax collector.',
    ),
    refs: ['MAT 9:9', 'MAT 10:3', 'MRK 2:14', 'LUK 5:27-29', 'ACT 1:13'],
    groups: ['jesus-and-the-twelve'],
    identityNote: en(
      'In the account of this call, Matthew 9:9 names the tax collector Matthew, while Mark 2:14 and Luke 5:27 name him Levi (in Mark, Levi the son of Alphaeus). Matthew 10:3 lists Matthew the tax collector among the Twelve. The atlas follows the common reading that Levi and Matthew are the same man.',
    ),
  },
  {
    id: 'james-alphaeus',
    name: en('James, son of Alphaeus'),
    searchTerms: ['James'],
    role: en('One of the Twelve'),
    summary: en('Named in each list of the Twelve; the Gospels and Acts record nothing else about him under this name.'),
    refs: ['MAT 10:3', 'MRK 3:18', 'LUK 6:15', 'ACT 1:13'],
    groups: ['jesus-and-the-twelve'],
    identityNote: en(
      'Tradition sometimes identifies him with James the less, whose mother Mary watched the crucifixion (Mark 15:40); the Gospels do not make this identification, and the atlas keeps them separate. Mark also calls Levi the son of Alphaeus (Mark 2:14) without saying whether this is the same Alphaeus.',
    ),
  },
  {
    id: 'thaddaeus',
    name: en('Thaddaeus'),
    alternateNames: ['Lebbaeus', 'Judas son of James', 'Judas (not Iscariot)'],
    role: en('One of the Twelve'),
    summary: en(
      'One of the Twelve, though the lists of the Twelve do not all give him the same name. John 14:22 records a question that Judas (not Iscariot) asked Jesus.',
    ),
    refs: ['MAT 10:3', 'MRK 3:18', 'LUK 6:16', 'ACT 1:13', 'JHN 14:22'],
    groups: ['jesus-and-the-twelve'],
    identityNote: en(
      'Matthew lists Lebbaeus, who was also called Thaddaeus (Matthew 10:3), and Mark lists Thaddaeus (Mark 3:18). Luke and Acts have no Thaddaeus but list Judas the son of James (Luke 6:16; Acts 1:13), and John mentions a Judas who was not Iscariot (John 14:22). Apart from this name, the lists in Matthew, Mark and Luke name the same twelve, and the atlas follows the common reading that these names belong to one apostle. Tradition sometimes also identifies him with Jude, author of the Epistle of Jude; that is traditional and uncertain and is not assumed here.',
    ),
  },
  {
    id: 'simon-zealot',
    name: en('Simon the Zealot'),
    searchTerms: ['Simon'],
    role: en('One of the Twelve'),
    summary: en('Named in each list of the Twelve; the Gospels and Acts record nothing else about him.'),
    refs: ['MAT 10:4', 'MRK 3:18', 'LUK 6:15', 'ACT 1:13'],
    groups: ['jesus-and-the-twelve'],
  },

  // Other disciples and followers
  {
    id: 'nathanael',
    name: en('Nathanael'),
    role: en('Disciple from Cana in Galilee'),
    summary: en(
      'Philip told him about Jesus, and when Jesus said he had seen him under the fig tree, Nathanael called him the Son of God and King of Israel. He was among the disciples to whom Jesus appeared by the sea of Tiberias.',
    ),
    refs: ['JHN 1:45-49', 'JHN 21:2'],
    groups: ['gospel-figures'],
    identityNote: en(
      'Nathanael appears only in John. Tradition sometimes identifies him with Bartholomew; the Gospels do not make this identification, and the atlas treats them as separate people.',
    ),
    origins: [{ placeId: 'cana', ref: 'JHN 21:2' }],
  },
  {
    id: 'beloved-disciple',
    name: en('The disciple whom Jesus loved'),
    searchTerms: ['beloved disciple'],
    role: en('Unnamed disciple in John’s Gospel'),
    summary: en(
      'A disciple whom John’s Gospel describes but never names. He leaned on Jesus’ chest at the supper, stood by the cross, outran Peter to the empty tomb, and recognized the risen Jesus by the sea of Tiberias.',
    ),
    refs: ['JHN 13:23-25', 'JHN 19:26-27', 'JHN 20:2-8', 'JHN 21:7', 'JHN 21:20-24'],
    groups: ['gospel-figures'],
    identityNote: en(
      'John 21:24 says this is the disciple who testifies to these things and wrote them. Tradition identifies him with John son of Zebedee, but the Gospel does not name him, and the atlas does not assume the identification.',
    ),
  },
  {
    id: 'joanna',
    name: en('Joanna'),
    role: en('Follower of Jesus, wife of Chuzas'),
    summary: en(
      'The wife of Chuzas, Herod’s steward. Luke names her among the women who had been healed and who were with Jesus and the Twelve, serving them from their possessions, and among the women who told the apostles about the empty tomb.',
    ),
    refs: ['LUK 8:1-3', 'LUK 24:10'],
    groups: ['gospel-figures', 'women'],
  },
  {
    id: 'salome',
    name: en('Salome'),
    role: en('Follower of Jesus from Galilee'),
    summary: en(
      'Mark names her among the women who had followed and served Jesus in Galilee and who watched the crucifixion from a distance, and among those who bought spices to anoint his body.',
    ),
    refs: ['MRK 15:40-41', 'MRK 16:1'],
    groups: ['gospel-figures', 'women'],
    identityNote: en(
      'Named only in Mark. She is sometimes identified with the mother of the sons of Zebedee, whom Matthew lists at the cross (Matthew 27:56); that identification is uncertain and is not made here. The daughter of Herodias (Mark 6:22) is not named in the Gospels.',
    ),
  },
  {
    id: 'mary-mother-of-james',
    name: en('Mary, mother of James and Joses'),
    alternateNames: ['Mary the mother of James', 'Mary the mother of Joses'],
    searchTerms: ['Mary'],
    role: en('Follower of Jesus at the cross and tomb'),
    summary: en(
      'Mark names her among the women from Galilee who watched the crucifixion from a distance and saw where Jesus was laid, and among those who brought spices to the tomb. Luke names her among the women who told the apostles about the empty tomb.',
    ),
    refs: ['MRK 15:40', 'MRK 15:47', 'MRK 16:1', 'MAT 27:56', 'LUK 24:10'],
    groups: ['gospel-figures', 'women'],
    identityNote: en(
      'Mark calls her the mother of James the less and of Joses (15:40), the mother of Joses (15:47) and the mother of James (16:1). Matthew’s “the other Mary” (Matthew 27:61; 28:1) is commonly taken to be her, but the atlas does not assume it. Her son James the less is not identified in the text with James son of Alphaeus.',
    ),
  },
  {
    id: 'mary-wife-of-clopas',
    name: en('Mary, wife of Clopas'),
    searchTerms: ['Mary', 'Mary of Clopas'],
    role: en('Woman standing by the cross'),
    summary: en('John names her among the women standing by Jesus’ cross, with his mother, his mother’s sister and Mary Magdalene.'),
    refs: ['JHN 19:25'],
    groups: ['gospel-figures', 'women'],
    identityNote: en(
      'Named only in John 19:25, which can be read as listing three or four women, so it is unclear whether she is also the sister of Jesus’ mother. Clopas is not identified in the text with Cleopas of Luke 24:18, and she is not identified with Mary the mother of James; neither identification is assumed here.',
    ),
  },

  // Luke 1: John the Baptist's parents
  {
    id: 'zechariah',
    name: en('Zacharias'),
    searchTerms: ['Zechariah', 'Zachariah'],
    role: en('Priest, father of John the Baptist'),
    summary: en(
      'A priest of the division of Abijah. While he burned incense in the temple, the angel Gabriel told him that his wife Elizabeth would bear a son; he could not speak until he wrote that the child’s name was John.',
    ),
    refs: ['LUK 1:5-23', 'LUK 1:59-67', 'LUK 3:2'],
    groups: ['gospel-figures'],
  },
  {
    id: 'elizabeth',
    name: en('Elizabeth'),
    role: en('Mother of John the Baptist'),
    summary: en(
      'Wife of the priest Zacharias, of the daughters of Aaron. Barren and advanced in years, she conceived and bore John, and when her relative Mary visited her, she blessed Mary.',
    ),
    refs: ['LUK 1:5-7', 'LUK 1:24-25', 'LUK 1:36', 'LUK 1:39-45', 'LUK 1:57-60'],
    groups: ['gospel-figures', 'women'],
  },

  // Rulers and religious leaders
  {
    id: 'herod-antipas',
    name: en('Herod the tetrarch'),
    alternateNames: ['Herod'],
    searchTerms: ['Herod Antipas', 'Antipas'],
    role: en('Tetrarch of Galilee'),
    summary: en(
      'Tetrarch of Galilee (Luke 3:1). He had John the Baptist imprisoned and beheaded, and Luke says that when Pilate sent Jesus to him in Jerusalem, he questioned him and, with his soldiers, mocked him.',
    ),
    refs: ['LUK 3:1', 'LUK 3:19-20', 'MAT 14:1-10', 'LUK 23:7-12'],
    groups: ['authorities'],
    identityNote: en(
      'The Gospels call him Herod; Matthew and Luke call him the tetrarch, and Mark calls him King Herod (Mark 6:14). He is not the King Herod of Matthew 2, whose death Matthew reports (Matthew 2:19). Historians usually call him Herod Antipas.',
    ),
  },
  {
    id: 'pontius-pilate',
    name: en('Pontius Pilate'),
    alternateNames: ['Pilate'],
    role: en('Governor of Judea'),
    summary: en(
      'Governor of Judea (Luke 3:1). The chief priests handed Jesus over to him; he released Barabbas, handed Jesus over to be crucified, and afterward granted Jesus’ body to Joseph of Arimathaea.',
    ),
    refs: ['LUK 3:1', 'MAT 27:2', 'MRK 15:1-15', 'JHN 19:38'],
    groups: ['authorities'],
  },
  {
    id: 'caiaphas',
    name: en('Caiaphas'),
    role: en('High priest at the time of Jesus’ trial'),
    summary: en(
      'High priest that year, according to John. He told the council it was better for one man to die for the people than for the whole nation to perish, and Matthew says Jesus was led to him after his arrest.',
    ),
    refs: ['MAT 26:3', 'MAT 26:57', 'LUK 3:2', 'JHN 11:49-50', 'JHN 18:13-14'],
    groups: ['authorities'],
    identityNote: en(
      'Matthew and John name Caiaphas as the high priest; Mark and Luke do not name the high priest in their accounts of Jesus’ trial.',
    ),
  },
  {
    id: 'annas',
    name: en('Annas'),
    role: en('High priest, father-in-law of Caiaphas'),
    summary: en(
      'Luke names him with Caiaphas in the high priesthood (Luke 3:2). John says Jesus was taken to him first after the arrest, as the father-in-law of Caiaphas, and that Annas then sent him bound to Caiaphas.',
    ),
    refs: ['LUK 3:2', 'JHN 18:13', 'JHN 18:24', 'ACT 4:6'],
    groups: ['authorities'],
    identityNote: en(
      'John 18:19–23 calls the man who questioned Jesus the high priest without naming him. Because Annas sent Jesus to Caiaphas only afterward (18:24), he is often taken to be Annas, but the text leaves it open.',
    ),
  },
  {
    id: 'nicodemus',
    name: en('Nicodemus'),
    role: en('Pharisee and ruler of the Jews'),
    summary: en(
      'A Pharisee and ruler of the Jews who came to Jesus by night. He later objected that the law does not judge a man without first hearing him, and he brought myrrh and aloes for Jesus’ burial.',
    ),
    refs: ['JHN 3:1-2', 'JHN 7:50-51', 'JHN 19:39'],
    groups: ['gospel-figures'],
  },

  // Others in the Gospel narratives
  {
    id: 'jairus',
    name: en('Jairus'),
    role: en('Ruler of the synagogue'),
    summary: en(
      'A ruler of the synagogue who fell at Jesus’ feet and begged him to come to his dying daughter. Jesus went to his house with Peter, James and John and raised the twelve-year-old girl.',
    ),
    refs: ['MRK 5:22-24', 'MRK 5:35-43', 'LUK 8:41-42'],
    groups: ['gospel-figures'],
  },
  {
    id: 'woman-with-a-flow-of-blood',
    name: en('The woman with a flow of blood'),
    searchTerms: ['issue of blood', 'discharge of blood', 'bleeding', 'hemorrhage'],
    role: en('Woman healed by touching Jesus’ clothes'),
    summary: en(
      'She had suffered a discharge of blood for twelve years and had spent all she had on physicians. In the crowd she touched Jesus’ clothes and was healed at once, and he told her that her faith had made her well.',
    ),
    refs: ['MRK 5:25-34', 'MAT 9:20-22', 'LUK 8:43-48'],
    groups: ['gospel-figures', 'women'],
  },
  {
    id: 'peters-mother-in-law',
    name: en('Peter’s mother-in-law'),
    searchTerms: ['Simon’s mother-in-law', 'mother-in-law'],
    role: en('Healed of a fever at Capernaum'),
    summary: en(
      'She lay sick with a fever in the house of Simon and Andrew at Capernaum. Jesus took her by the hand and raised her up; the fever left her, and she served them.',
    ),
    refs: ['MRK 1:30-31', 'MAT 8:14-15', 'LUK 4:38-39'],
    groups: ['gospel-figures', 'women'],
  },
  {
    id: 'samaritan-woman',
    name: en('The Samaritan woman'),
    searchTerms: ['woman at the well', 'woman of Samaria'],
    role: en('Woman of Samaria at Jacob’s well'),
    summary: en(
      'A woman of Samaria who came to draw water at Jacob’s well, where Jesus asked her for a drink and spoke with her about living water. She told the people of the city about him, and many Samaritans believed because of her word.',
    ),
    refs: ['JHN 4:7-9', 'JHN 4:28-29', 'JHN 4:39-42'],
    origins: [{ placeId: 'samaria', ref: 'JHN 4:7' }],
    groups: ['gospel-figures', 'women'],
  },
  {
    id: 'syrophoenician-woman',
    name: en('The Syrophoenician woman'),
    searchTerms: ['Canaanite woman', 'Greek woman'],
    role: en('Mother who sought healing for her daughter'),
    summary: en(
      'A Greek woman, Syrophoenician by birth, who begged Jesus in the region of Tyre and Sidon to drive a demon out of her daughter. After her reply about the dogs eating the children’s crumbs, she went home and found the demon gone.',
    ),
    refs: ['MRK 7:25-30', 'MAT 15:22-28'],
    groups: ['gospel-figures', 'women'],
    identityNote: en('Matthew’s account calls her a Canaanite woman (Matthew 15:22).'),
  },
  {
    id: 'widow-of-nain',
    name: en('The widow of Nain'),
    role: en('Widow whose only son was raised'),
    summary: en(
      'As her dead only son was being carried out near the city gate of Nain, Jesus met the procession. He had compassion on her, raised the young man and gave him to his mother.',
    ),
    refs: ['LUK 7:12-15'],
    groups: ['gospel-figures', 'women'],
  },
  {
    id: 'man-born-blind',
    name: en('The man born blind'),
    role: en('Beggar given sight at the pool of Siloam'),
    summary: en(
      'A man blind from birth who used to sit and beg. Jesus anointed his eyes with mud and sent him to wash in the pool of Siloam, and he came back seeing. Later, when Jesus found him, he said he believed and worshiped him.',
    ),
    refs: ['JHN 9:1-11', 'JHN 9:35-38'],
    groups: ['gospel-figures'],
  },

  // The passion
  {
    id: 'barabbas',
    name: en('Barabbas'),
    role: en('Prisoner released instead of Jesus'),
    summary: en(
      'The prisoner whom Pilate released to the crowd instead of Jesus. Mark says he was held with insurgents who had committed murder in the insurrection, Luke says he was imprisoned for revolt and murder, and John calls him a robber.',
    ),
    refs: ['MRK 15:6-15', 'MAT 27:15-26', 'LUK 23:18-19', 'JHN 18:40'],
    groups: ['gospel-figures'],
  },
  {
    id: 'simon-of-cyrene',
    name: en('Simon of Cyrene'),
    role: en('Compelled to carry Jesus’ cross'),
    summary: en(
      'A man of Cyrene, the father of Alexander and Rufus, who was coming from the country when he was compelled to carry Jesus’ cross.',
    ),
    refs: ['MRK 15:21', 'MAT 27:32', 'LUK 23:26'],
    origins: [{ placeId: 'cyrene', ref: 'MRK 15:21' }],
    groups: ['gospel-figures'],
  },
]
