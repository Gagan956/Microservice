const amqp = require('amqplib');

const rabbitmq_Url =  process.env.RABBITMQ_URL;

let connection, channel;

const connect = async () => {
    connection = await amqp.connect(rabbitmq_Url);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
    
}
 const subscribeTOQueue = async (queueName, callback) => {
    if(!channel)  await connect();
    await channel.assertQueue(queueName);
    channel.consume(queueName, (message) => {
        callback(message.content.toString());
        channel.ack(message); 
 });
}

publishToQueue = async (queueName, data) => {
    if(!channel)  await connect();
    await channel.assertQueue(queueName);
    channel.sendToQueue(queueName, Buffer.from(data));
}


module.exports = {
    subscribeTOQueue,
    publishToQueue,
    connect,
}