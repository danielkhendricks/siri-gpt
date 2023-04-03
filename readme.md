# Talk to siri and get answers from Chat-GPT

This is a simple PoC of a node.js app that uses GPT-3.5 to respond to voice prompts from siri. I tested this only through bluetooth from my iPhone using shortcuts to my Macbook Pro.

## Todo list
- Create a guide on how to setup shortcuts on IOS.

# Swift draft

```swift
import UIKit
import Alamofire

class ViewController: UIViewController {
    
    let openAIUrl = "https://api.openai.com/v1/chat/completions"
    let headers: HTTPHeaders = [
        "Content-Type": "application/json",
        "Authorization": "Bearer " + ProcessInfo.processInfo.environment["OPENAI_API_KEY"]!
    ]
    
    @IBAction func siriButtonPressed(_ sender: Any) {
        let content = "Hello, Siri!"
        generateResponse(content: content) { response in
            print(response)
        }
    }
    
    func generateResponse(content: String, completion: @escaping (String) -> Void) {
        let requestData: [String: Any] = [
            "model": "gpt-3.5-turbo",
            "messages": [
                ["role": "user", "content": content]
            ],
            "temperature": 0.7
        ]
        
        AF.request(openAIUrl, method: .post, parameters: requestData, encoding: JSONEncoding.default, headers: headers).responseJSON { response in
            switch response.result {
            case .success(let data):
                if let json = data as? [String: Any], let choices = json["choices"] as? [[String: Any]], let message = choices.first?["text"] as? String {
                    completion(message)
                }
            case .failure(let error):
                print(error.localizedDescription)
            }
        }
    }
}
```