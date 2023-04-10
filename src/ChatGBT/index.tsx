import React, { useState } from "react";
import "./styles.css";
import { Configuration, OpenAIApi } from "openai";

const apis = [
  {
    name: {
      title: "Keywords",
      desc: "Extract keywords from this text",
      color: "#ef4146",
    },
    props: {
      model: "text-davinci-003",
      temperature: 0.5,
      max_tokens: 60,
      top_p: 1.0,
      frequency_penalty: 0.8,
      presence_penalty: 0.0,
    },
  },
  {
    name: {
      title: "Q&A",
      desc: "Answer questions based on existing knowledge.",
      color: "#1DBF83",
    },
    props: {
      model: "text-davinci-003",
      temperature: 0,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    },
  },
  {
    name: {
      title: "Chat",
      desc: "Open ended conversation with an AI assistant.",
      color: "#7941DD",
    },
    props: {
      model: "text-davinci-003",
      temperature: 0.9,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"],
    },
  },
  {
    name: {
      title: "Grammer Correction",
      desc: "Corrects sentences into standard English.",
      color: "#EE4046",
    },
    props: {
      model: "text-davinci-003",
      temperature: 0,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    },
  },
  {
    name: {
      title: "Explain Code",
      desc: "Explain a complicated piece of code.",
      color: "#E057C2",
    },
    props: {
      model: "code-davinci-002",
      temperature: 0,
      max_tokens: 200,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ['"""'],
    },
  },
];

const ChatGBT = () => {
  const configuration = new Configuration({
    apiKey: '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',

    //  ^-----^ put your API key here   //    visit and register at  (https://beta.openai.com/account/api-keys) for Api keys
  });
  const openai = new OpenAIApi(configuration);
  const [response, setResponse] = useState<any>();
  const [api, setApi] = useState<any>({});
  const [sectionType, setSectionType] = useState("select");
  const [isLoading, setIsLoading] = useState(false);
  const [quotes, setQuotes] = useState<string[]>([]);

  const handleApi = (value: string) => {
    let newObj = {
      name: { ...api.name },
      props: { ...api.props, prompt: value },
    };
    setApi(newObj);
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    let response:any = await openai.createCompletion(api.props);
    response = response?.data?.choices[0]?.text!;
    response = response.split('\n')
    setResponse(response);
    setIsLoading(false);
    console.log(response)
    // setQuotes(stringToArray(response?.data?.choices[0]?.text!));
  };

  const handleBack = () => {
    setSectionType("select");
    setApi({});
    setResponse("");
    setQuotes([]);
  };

  return (
    <div>
      <div className="gpt-container">
        <div className="gpt-text">Ask a Question to your AI friend</div>
        {sectionType === "select" && (
          <div className="section-types">
            <div className="api-boxes">
              {apis.map((item, i) => {
                return (
                  <div
                    key={i}
                    className="api-item"
                    style={{ background: item.name.color }}
                    onClick={() => {
                      setSectionType("inputs");
                      setApi(item);
                    }}
                  >
                    {item?.name?.title}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {sectionType === "inputs" && (
          <div className="section-inputs">
            <div className="gpt-api" style={{ color: api?.name?.color }}>
              {api?.name?.title}
            </div>
            <div className="gpt-input">
              <input
                className="gpt-input-box"
                placeholder="Ask your question here"
                type="text"
                onChange={(e) => {
                  handleApi(e.target.value);
                }}
              />
            </div>
            {isLoading ? (
              <h3>Loading...</h3>
            ) : (
              <div className="btn-grp">
                <button
                  className="gpt-btn-blue"
                  onClick={() => {
                    handleBack();
                  }}
                >
                  Back
                </button>
                <button
                  className="gpt-btn"
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Submit
                </button>
              </div>
            )}


<div className="gpt-response">
                {response?.length > 0 && (
                  response.map((r:string) => {
                    return(
                      r  === "" ? null: <li>{r}</li>
                    )
                  })
                )}
            </div>

            {/* <div className="gpt-response">
              {quotes.length > 0 ? (
                <ol>
                  {quotes.map((quote) => (
                    <li key={quote}>{quote}</li>
                  ))}
                </ol>
              ) : (
                <i> {response}.</i>
              )}
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatGBT;
