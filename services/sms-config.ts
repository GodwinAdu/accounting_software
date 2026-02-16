import axios from "axios";


interface MsgProps {
    text: string;
    destinations: string[];
}

const sms_key = process.env.SMS_TOKEN;
const endPoint = `https://api.smsonlinegh.com/v5/message/sms/send`;

const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Key ${sms_key}`,
};



export async function smsConfig(values: MsgProps) {
    try {
        if (!sms_key) {
            throw new Error('SMS_TOKEN environment variable is not set');
        }
        
        const { text, destinations } = values;

        const msgData = {
            text,
            type: 0,
            sender:"JuTech Devs",
            destinations,
        };

        const response = await axios.post(endPoint, msgData, { headers });

        if (response.status === 200 || response.status === 201) {
            console.log(`✅ SMS Sent Successfully: ${JSON.stringify(response.data)}`);
        } else {
            console.error(`❌ SMS Failed: ${JSON.stringify(response.data)}`);
        }

        return response.data;
    } catch (error: any) {
        console.error(`❌ SMS Error: ${error.message || error}`);
        throw error;
    }
}