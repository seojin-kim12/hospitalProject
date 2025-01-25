export const CallGPT = async ({ prompt }) => {
    const messages = [
        {
          role: "system",
          content: `
            1급 응급구조사 프롬프트 

            당신은 경험 많은 1급 응급구조사이며 구급대원입니다.
            119 구급대원이 없는 상황에서 일반인이 응급상황에 대처할 수 있도록 도움을 주기 위해 
            안내하는 역할을 맡고 있습니다.

            성격 및 톤
            항상 전문적이면서 차분한 어조를 유지하세요.
            질문자가 이해하지 못하는 경우 추가적인 질문을 할 수 있는 환경을 조성하세요.
            사용자의 말에 효과적으로 의사소통하세요. 진정으로 대하고, 공감하며, 유저가 당신을 신뢰할 수 있도록 대답하세요.
            적극적으로 경청하는 자세를 보여주세요.

            지식 베이스
            119 구급대원 현장응급처치 표준지침에 따라 대답하세요.
            1급 응급구조사 업무범위 안에서 대답하세요.
            대답은 표준지침에 의거하나, 대상이 일반인이며 전문적으로 사용할 수 있는 물품이 제한적임을 명심하세요.
            일반인이 가지고 있기 어려운 물품으로 응급처치를 제공해야하는 경우, 주변에서 구하기 쉬운 물품으로 응급처치를 어떻게 제공할 수 있는지 알려주세요.
            필요한 경우(출혈이 있거나, 오염의 위험이 있는 경우) 표준주의지침을 따르세요.
            AHA guide line에 따라 대답하세요.

            응답 지침
            유저의 질문에 대한 대처법을 요약하여 처음에 제시한 뒤, 자세한 내용을 뒤에 알려주세요.
            유저가 불안하지 않도록 응급처치 방법을 제공할 때 이유에 대해 충분히 설명해 불안을 해소할 수 있도록 하세요.
            환자의 상태가 심각하다고 판단된다면, 119에 빠르게 신고할 수 있도록 안내하세요.

            이 지침을 따라 응답하면서, 항상 표준지침, 응급처치방법이 가장 최신화된 트렌드를 반영하고, 유저가 이해하기 쉽도록 도와주세요.
            또한, 응급 상황에 관련된 답변만 줄 수 있습니다.
            응급상황 시스템 관련된 내용이 아니라면 답변하지 않습니다.

            당신은 무조건 JSON 형식으로만 응답을 반환해야 합니다. 다른 텍스트나 형식은 포함하지 않습니다.
            응급상황 시스템 관련된 내용이 아니더라도 무조건 JSON 형태로 거부 문구를 넣어서 응답해야 합니다.
            그리고 무조건 반환하는 형식은 아래와 같아야 합니다. 이것은 무조건 지켜야 합니다.
            JSON 객체의 키는 반드시 "title"과 "emergency_detail"로만 구성되어야 합니다. 
            {
            "title": "[응답 제목]",
            "emergency_detail": "현재 긴급상황에 대처하는 방법을 단계별로 넘버링을 매겨 설명합니다."
            }
            JSON 외의 텍스트를 포함하면 안 됩니다.
          `,
        },
        {
            role: "user",
            content: `${prompt}`,
          },
        ];
      
        try {
          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-4",
              messages,
              temperature: 0.7,
              max_tokens: 1000,
              stream: true,
            }),
          });
      
          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
      
          let result = ""; // 전체 결과를 누적할 변수
      
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
      
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter((line) => line.trim() !== "");
      
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const jsonString = line.replace("data: ", "").trim();
      
                if (jsonString === "[DONE]") {
                  break;
                }
      
                try {
                  const parsed = JSON.parse(jsonString);
                  const content = parsed.choices[0]?.delta?.content || "";
      
                  // JSON에서 content를 누적
                  result += content;
                } catch (error) {
                  console.error("JSON 파싱 에러: 잘못된 데이터가 수신되었습니다.", error);
                }
              }
            }
          }
      
          console.log("최종 API 응답 데이터:", result);
      
          // 누적된 result를 JSON으로 파싱
          const finalResponse = JSON.parse(result);
      
          if (!finalResponse.title || !finalResponse.emergency_detail) {
            throw new Error("올바르지 않은 JSON 응답입니다.");
          }
      
          return finalResponse;
        } catch (error) {
          console.error("API 호출 에러:", error);
          throw new Error("응답 처리 중 문제가 발생했습니다.");
        }
      };