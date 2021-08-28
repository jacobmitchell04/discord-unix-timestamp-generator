import React, { useState } from 'react';
import 'bulma/css/bulma.min.css'
import './App.css';
import dayjs from 'dayjs';

interface TimestampFormat {
    style: string;
    name: string;
    example: string;
    default?: boolean;
}

const TIMESTAMP_FORMAT: TimestampFormat[]  = [
    {
        style: 't',
        name: 'Short Time',
        example: '16:20'
    },
    {
        style: 'T',
        name: 'Long Time',
        example: '16:20:30'
    },
    {
        style: 'd',
        name: 'Short Date',
        example: '20/04/2021'
    },
    {
        style: 'D',
        name: 'Long Date',
        example: '20 April 2021'
    },
    {
        style: 'f',
        name: 'Short Date / Time',
        example: '20 April 2021 16:20',
        default: true
    },
    {
        style: 'F',
        name: 'Long Date / Time',
        example: 'Tuesday, 20 April 2021 16:20'
    },
    {
        style: 'R',
        name: 'Relative Time',
        example: '2 months ago'
    }
]

function App() {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [format, setFormat] = useState(TIMESTAMP_FORMAT.find((format: TimestampFormat) => format.default)?.style || '');


    const generateTimestamp = (): number | null => {
        if (!date) return null;
        return dayjs(date + ' ' + time).unix();
    }

    const generateFormat = (): string | null => {
        if (!generateTimestamp()) return null;
        const isDefault: boolean = TIMESTAMP_FORMAT.find((data: TimestampFormat) => data.style === format)?.default || false;
        return '<t:' + generateTimestamp() + (!isDefault ? ':' + format : '') + '>';
    }

    const copyFormat = async (type: 'timestamp' | 'formatted'): Promise<void> => {
        if (!generateTimestamp() || !generateFormat()) return;
        return await navigator.clipboard.writeText(type === 'timestamp' ? generateTimestamp() as unknown as string : generateFormat() as unknown as string);
    }

    return (
        <div className="App">
            <section className="section">
                <div className="container">
                    <h2 className="title is-1 has-text-centered">
                        Discord Unix Timestamp Generator
                    </h2>
                    <div className="columns margin-top-40">
                        <div className="column is-half">
                            <h3 className="title is-3">
                                Generate Timestamp
                            </h3>

                            <div className="field">
                                <label className="label">
                                    Date
                                </label>
                                <div className="control">
                                    <input className="input" type="date" onChange={(data) => setDate(data.target.value)} />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">
                                    Time
                                </label>
                                <div className="control">
                                    <input className="input" type="time" onChange={(data) => setTime(data.target.value)} />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">
                                    Format
                                </label>
                                <div className="control">
                                    <div className="select">
                                        <select onChange={(data) => setFormat(data.target.value)}>
                                            {
                                                TIMESTAMP_FORMAT.map((format: TimestampFormat) => (
                                                    <option key={format.style} value={format.style} selected={format.default}>{format.name} ({format.example}) {format.default ? '*' : ''}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="help">
                                    <span>
                                        * Default field
                                    </span>
                                </div>
                            </div>

                        </div>
                        <div className="column is-half">
                            <h3 className="title is-3">
                                Discord Unix Timestamp Generator
                            </h3>

                            <h5 className="title is-5">
                                Unix Timestamp
                            </h5>
                            <pre>
                                {generateTimestamp() || 'No timestamp generated'}
                            </pre>

                            <h5 className="title is-5">
                                Formatted Message
                            </h5>

                            <pre>
                                {generateFormat() || 'No format'}
                            </pre>

                            {
                                generateTimestamp() && generateFormat() &&
                                    <div className="buttons copy-buttons">
                                        <button className="button is-info" onClick={() => copyFormat('timestamp').then(() => window.alert('Timestamp has been copied to your clipboard successfully.'))}>
                                            Copy Timestamp
                                        </button>
                                        <button className="button is-info" onClick={() => copyFormat('formatted').then(() => window.alert('Format has been copied to your clipboard successfully.'))}>
                                            Copy Formatted
                                        </button>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </section>
        </div>
  );
}

export default App;
