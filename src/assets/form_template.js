const form_template = [
  {
    "type":"label",
    "id":"personalInfo",
    "label":"Personal Information",
  },
  {
    "type":"text",
    "id":"firstName",
    "label":"First Name",
    "required":"true",
  },
  {
    "type":"text",
    "id":"lastName",
    "label":"Last Name",
    "required":"true",
  },
  {
    "type":"text",
    "id":"middleInitial",
    "label":"Middle Initial",
    "required":"true",
    "maxLength":"1",
  },
  {
    "type":"tel",
    "id":"phone",
    "label":"Phone",
    "required":"true",
    "placeholder":"1234567890",
  },
  {
    "type":"date",
    "id":"dob",
    "label":"Date of Birth",
    "required":"true",
  },
  {
    "type":"number",
    "id":"age",
    "label":"Age",
    "required":"true",
  },
  {
    "type":"select",
    "id":"race",
    "label":"Race",
    "required":"true",
    "options":["","White","African American","American Indian", "Asian", "Pacific Islander"]
  },
  {
    "type":"select",
    "id":"ethnicity",
    "label":"Ethnicity",
    "required":"true",
    "options":["","Not Hispanic or Latino", "Hispanic or Latino"]
  },
  {
    "type":"select",
    "id":"sex",
    "label":"Sex",
    "required":"true",
    "options":["","Male", "Female"],
  },
  {
    "type":"label",
    "id":"address",
    "label":"Address",
  },
  {
    "type":"text",
    "id":"streetAddress",
    "label":"Street Address",
    "required":"true",
  },
  {
    "type":"text",
    "id":"cityName",
    "label":"City",
    "required":"true",
  },
  {
    "type":"text",
    "id":"countyName",
    "label":"County",
    "required":"true",
  },
  {
    "type":"text",
    "id":"stateName",
    "label":"State",
    "required":"true",
  },
  {
    "type":"number",
    "id":"zipCode",
    "label":"Zip",
    "required":"true",
  },
  {
    "type":"label",
    "id":"questions",
    "label":"Required Questions",
  },
  {
    "type":"select",
    "id":"workplace",
    "label":"Do you currently work in a healthcare setting with direct patient contact?",
    "required":"true",
    "options":["","No", "Yes", "Unknown"]
  },
  {
    "type":"select",
    "id":"symptoms",
    "label":"Do you currently have one or more of the following symptoms?",
    "description":"Fever or chills, Cough, Shortness of breath or difficulty breathing, Fatigue, Muscle or body aches, Headache, New loss of taste or smell, Sore throat, Congestion or runny nose, Nausea or vomiting, Diarrhea",
    "required":"true",
    "options":["","No", "Yes", "Unknown"]
  },
  {
    "type":"date",
    "id":"symptomsStart",
    "label":"[If you have any] When did your symptoms start?",
    "required":"false",
  },
  {
    "type":"select",
    "id":"pregnancy",
    "label":"Are you currently pregnant?",
    "required":"false",
    "options":["","No", "Yes", "Unknown"]
  },
  {
    "type":"select",
    "id":"residence",
    "label":"Do you currently reside in a group care setting, such as, but not limited to",
    "description":"Nursing home, Residential care location for people with intellectual and developmental disabilities, Psychiatric treatment facility, Group home, Dormitory, Board and care home, Homeless shelter, or Foster care setting.",
    "required":"true",
    "options":["","No", "Yes", "Unknown"]
  },
  {
    "type":"select",
    "id":"testing",
    "label":"Have you had a COVID-19 test?",
    "required":"false",
    "options":["","No", "Yes", "Unknown"]
  },
]
export default form_template;
