from agents.rag_agent import search_eci_docs

def main():
    # This question is directly answered in the "Do's and Dont's" PDF
    test_query = "Can a candidate use a temple or church for election propaganda?"
    
    print(f"🚀 Sending query to ECI Data Store...")
    answer = search_eci_docs(test_query)
    
    print("\n--- AI ANSWER BASED ON YOUR PDFs ---")
    print(answer)
    print("------------------------------------\n")

if __name__ == "__main__":
    main()