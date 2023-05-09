import MeetupDetail from '../../components/meetups/MeetupDetail';
import {MongoClient, ObjectId} from 'mongodb';
import Head from 'next/dist/next-server/lib/head';

function MeetupDetails(props) {
    return (
        <>
            <Head>
                <title>{props.meetupdata.title}</title>
                <meta
                    name='description'
                    content={props.meetupdata.description}
                />
            </Head>
            <MeetupDetail
                image={props.meetupData.image}
                title={props.meetupData.title}
                address={props.meetupData.address}
                description={props.meetupData.description}
            />
        </>
    );
}

export async function getStaticPaths() {
    const client = await MongoClient.connect(
        'mongodb+srv://manimani:MRrKDo32gleZOPDo@cluster0.qfuamda.mongodb.net/meetups?retryWrites=true&w=majority',
    );
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find({}, {_id: 1}).toArray();

    console.log(meetups);

    client.close();

    return {
        fallback: false,
        paths: meetups.map((meetup) => ({
            params: {meetupId: meetup._id.toString()},
        })),
        // [
        //     {
        //         params: {
        //             meetupId: 'm1',
        //         },
        //     },
        //     {
        //         params: {
        //             meetupId: 'm2',
        //         },
        //     },
        // ],
    };
}

export async function getStaticProps(context) {
    // fetch data for a single meetup

    const meetupId = context.params.meetupId;

    const client = await MongoClient.connect(
        'mongodb+srv://manimani:MRrKDo32gleZOPDo@cluster0.qfuamda.mongodb.net/meetups?retryWrites=true&w=majority',
    );
    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const selectedMeetup = await meetupsCollection.findOne({
        _id: new ObjectId(meetupId),
    });

    console.log(selectedMeetup);

    client.close();

    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                image: selectedMeetup.image,
                description: selectedMeetup.description,
            },
            // {
            //     image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
            //     id: meetupId,
            //     title: 'First Meetup',
            //     address: 'Some Street 5, Some City',
            //     description: 'This is a first meetup',
            // },
        },
    };
}

export default MeetupDetails;
