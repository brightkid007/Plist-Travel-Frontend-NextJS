import FormInput from "@/components/common/form/FormInput";
import { useState, useEffect, useRef, useCallback } from "react";

const FAQs = ({ faqs = [], onUpdate }) => {
  // Initialize with at least one empty FAQ if no FAQs provided
  const [localFaqs, setLocalFaqs] = useState(() => {
    if (faqs && faqs.length > 0) {
      return faqs;
    }
    return [{ question: "", answer: "" }];
  });
  
  const isInitialMount = useRef(true);
  const lastUpdateRef = useRef(JSON.stringify(localFaqs));

  // Sync with parent component when faqs prop changes (only on mount or when parent explicitly changes)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only update if parent prop actually changed (not from our own update)
    const currentPropString = JSON.stringify(faqs || []);
    const lastLocalString = lastUpdateRef.current;
    
    // If props changed but it's not from our update, sync from parent
    if (currentPropString !== lastLocalString) {
      if (faqs && faqs.length > 0) {
        setLocalFaqs(faqs);
        lastUpdateRef.current = currentPropString;
      } else if (faqs && faqs.length === 0 && localFaqs.length === 0) {
        setLocalFaqs([{ question: "", answer: "" }]);
      }
    }
  }, [faqs]);

  // Memoize the update function to prevent unnecessary re-renders
  const handleUpdate = useCallback((newFaqs) => {
    if (onUpdate) {
      // Filter out empty FAQs (both question and answer are empty)
      const validFaqs = newFaqs.filter(
        (faq) => faq.question?.trim() || faq.answer?.trim()
      );
      const validFaqsString = JSON.stringify(validFaqs);
      // Only update if there's a change
      if (validFaqsString !== lastUpdateRef.current) {
        onUpdate(validFaqs);
        lastUpdateRef.current = validFaqsString;
      }
    }
  }, [onUpdate]);

  // Update parent when local FAQs change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleUpdate(localFaqs);
    }, 300); // Debounce updates by 300ms

    return () => clearTimeout(timer);
  }, [localFaqs, handleUpdate]);

  const handleAddFAQ = () => {
    setLocalFaqs([...localFaqs, { question: "", answer: "" }]);
  };

  const handleRemoveFAQ = (index) => {
    if (localFaqs.length > 1) {
      const newFaqs = localFaqs.filter((_, i) => i !== index);
      setLocalFaqs(newFaqs);
    }
  };

  const handleFAQChange = (index, field, value) => {
    const newFaqs = [...localFaqs];
    newFaqs[index] = {
      ...newFaqs[index],
      [field]: value,
    };
    setLocalFaqs(newFaqs);
  };

  return (
    <div className="row y-gap-10 x-gap-20">
      <div className="col-auto">
        <h1 className="text-20 lh-14 fw-600">Frequently Asked Questions</h1>
      </div>
      <div className="col-auto ms-auto">
        <i
          className="icon-plus text-20 cursor-pointer"
          onClick={handleAddFAQ}
        />
      </div>
      {localFaqs.map((faq, index) => (
        <div className="col-12" key={index}>
          <div className="border-light rounded-8 px-15 py-15">
            <FormInput
              label={"Question"}
              type="text"
              placeholder="Enter Question"
              value={faq.question || ""}
              onChange={(e) => handleFAQChange(index, "question", e.target.value)}
            />
            <FormInput
              label={"Answer"}
              type="textarea"
              placeholder="Enter Answer"
              value={faq.answer || ""}
              onChange={(e) => handleFAQChange(index, "answer", e.target.value)}
              rows={3}
            />
            <div className="col-12 d-flex justify-end">
              <button
                disabled={localFaqs.length === 1}
                className={
                  "button text-12 px-5 fw-400 " +
                  (localFaqs.length === 1 ? "" : "text-red-1")
                }
                onClick={() => handleRemoveFAQ(index)}
              >
                <i className="icon-close mr-10 text-10"></i>Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQs;
