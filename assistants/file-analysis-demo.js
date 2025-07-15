// OpenAI Assistants API: Data Analysis Demo
// Demonstrates code interpreter and data analysis capabilities
import { OpenAI } from 'openai';
import 'dotenv/config';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID // Optional: Set organization header
});

class DataAnalysisAssistant {
  constructor() {
    this.assistant = null;
    this.thread = null;
  }

  async initialize() {
    console.log('� Creating Data Analysis Assistant...\n');
    
    this.assistant = await openai.beta.assistants.create({
      name: "Data Analyst",
      instructions: `You are a data analysis expert with access to file processing and code interpretation tools. You can:
      - Analyze CSV, JSON, and text files
      - Generate visualizations and charts
      - Perform statistical analysis
      - Write and execute Python code for data processing
      - Provide insights and recommendations based on data
      
      Always provide clear explanations of your analysis and suggest actionable insights.`,
      model: "gpt-4o-mini",
      tools: [
        { type: "code_interpreter" },
        { type: "file_search" }
      ]
    });

    this.thread = await openai.beta.threads.create();
    
    console.log(`✅ Data Analysis Assistant created: ${this.assistant.id}`);
    console.log(`✅ Thread created: ${this.thread.id}`);
  }

  async createSampleDataFile() {
    console.log('\n📊 Creating sample sales data file...');
    
    const salesData = {
      sales: [
        { month: "January", revenue: 45000, customers: 120, product: "Widget A" },
        { month: "February", revenue: 52000, customers: 135, product: "Widget A" },
        { month: "March", revenue: 48000, customers: 128, product: "Widget A" },
        { month: "April", revenue: 59000, customers: 145, product: "Widget B" },
        { month: "May", revenue: 61000, customers: 152, product: "Widget B" },
        { month: "June", revenue: 67000, customers: 168, product: "Widget B" },
        { month: "July", revenue: 72000, customers: 180, product: "Widget C" },
        { month: "August", revenue: 69000, customers: 175, product: "Widget C" },
        { month: "September", revenue: 74000, customers: 185, product: "Widget C" },
        { month: "October", revenue: 78000, customers: 195, product: "Widget C" },
        { month: "November", revenue: 82000, customers: 205, product: "Widget C" },
        { month: "December", revenue: 89000, customers: 220, product: "Widget C" }
      ]
    };

    const csvData = "Month,Revenue,Customers,Product\n" +
      salesData.sales.map(row => 
        `${row.month},${row.revenue},${row.customers},${row.product}`
      ).join('\n');

    const filePath = join(process.cwd(), 'sample-sales-data.csv');
    writeFileSync(filePath, csvData);
    
    console.log(`✅ Sample file created: ${filePath}`);
    return filePath;
  }

  async uploadFile(filePath) {
    try {
      console.log(`\n📤 Uploading file: ${filePath}`);
      
      const file = await openai.files.create({
        file: createReadStream(filePath),
        purpose: 'assistants'
      });
      
      this.uploadedFiles.push(file.id);
      console.log(`✅ File uploaded: ${file.id}`);
      
      return file.id;
    } catch (error) {
      console.error('❌ Error uploading file:', error.message);
      return null;
    }
  }

  async analyzeFile(fileId, analysisRequest) {
    try {
      console.log('\n🔍 Starting file analysis...');
      
      // Add the file to the thread and send analysis request
      await openai.beta.threads.messages.create(this.thread.id, {
        role: "user",
        content: analysisRequest,
        attachments: [
          {
            file_id: fileId,
            tools: [{ type: "code_interpreter" }]
          }
        ]
      });

      // Run the assistant
      const run = await openai.beta.threads.runs.createAndPoll(this.thread.id, {
        assistant_id: this.assistant.id
      });

      if (run.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(this.thread.id);
        const response = messages.data[0].content[0].text.value;
        
        console.log('\n📊 Analysis Results:');
        console.log('─'.repeat(60));
        console.log(response);
        
        return response;
      } else {
        console.log(`❌ Analysis failed: ${run.status}`);
        return null;
      }
    } catch (error) {
      console.error('❌ Error during analysis:', error.message);
      return null;
    }
  }

  async demonstrateFileCapabilities() {
    console.log('\n🎯 Demonstrating Assistants API File Capabilities');
    console.log('═'.repeat(60));

    // Create sample data but demonstrate with direct text input instead of file upload
    console.log('\n📊 Creating sample sales data...');
    const salesData = `Month,Revenue,Customers,Product
January,45000,120,Widget A
February,52000,135,Widget A
March,48000,128,Widget A
April,59000,145,Widget B
May,61000,152,Widget B
June,67000,168,Widget B
July,72000,180,Widget C
August,69000,175,Widget C
September,74000,185,Widget C
October,78000,195,Widget C
November,82000,205,Widget C
December,89000,220,Widget C`;

    console.log('✅ Sample data created (simulating file input)');

    // Demo 1: Data analysis with code interpreter
    console.log('\n📈 Demo 1: Data Analysis with Code Interpreter');
    await this.analyzeData(salesData, 
      `Here's sales data in CSV format:
${salesData}

Please analyze this data using the code interpreter:
1. Parse the CSV data
2. Calculate summary statistics (total revenue, average customers, etc.)
3. Identify trends and growth patterns
4. Generate insights and recommendations`
    );

    // Demo 2: Visualization and advanced analysis
    console.log('\n💻 Demo 2: Code Generation and Visualization');
    await this.analyzeData(salesData,
      `Using the same sales data, please:
1. Create Python code to process this CSV data
2. Generate charts showing revenue trends
3. Calculate month-over-month growth rates
4. Analyze product performance patterns
5. Execute the code and show results`
    );
  }

  async analyzeData(data, analysisRequest) {
    try {
      console.log('\n� Starting data analysis...');
      
      // Send the data and analysis request
      await openai.beta.threads.messages.create(this.thread.id, {
        role: "user",
        content: analysisRequest
      });

      // Run the assistant with code interpreter
      const run = await openai.beta.threads.runs.createAndPoll(this.thread.id, {
        assistant_id: this.assistant.id
      });

      if (run.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(this.thread.id);
        const latestMessage = messages.data[0];
        
        let response = '';
        if (latestMessage.content && latestMessage.content[0]) {
          if (latestMessage.content[0].text) {
            response = latestMessage.content[0].text.value;
          } else {
            response = 'Analysis completed, but response format not recognized.';
          }
        }
        
        console.log('\n📊 Analysis Results:');
        console.log('─'.repeat(60));
        console.log(response);
        
        return response;
      } else {
        console.log(`❌ Analysis failed: ${run.status}`);
        if (run.last_error) {
          console.log('Error details:', run.last_error.message);
        }
        return null;
      }
    } catch (error) {
      console.error('❌ Error during analysis:', error.message);
      return null;
    }
  }

  async cleanup() {
    try {
      console.log('\n🧹 Cleaning up resources...');
      
      // Delete assistant
      if (this.assistant) {
        await openai.beta.assistants.delete(this.assistant.id);
        console.log('✅ Assistant deleted');
      }
      
    } catch (error) {
      console.error('❌ Error during cleanup:', error.message);
    }
  }
}

async function runDataAnalysisDemo() {
  const assistant = new DataAnalysisAssistant();
  
  try {
    console.log('🚀 OpenAI Assistants API: Data Analysis Demo');
    console.log('═'.repeat(60));
    console.log('\nThis demo showcases Assistants API data analysis capabilities:');
    console.log('� Direct data processing without file upload');
    console.log('💻 Code interpreter for data analysis');
    console.log('📊 Automatic chart generation (via code interpreter)');
    console.log('🧠 Persistent context for complex analysis');
    console.log('\n' + '─'.repeat(60));

    await assistant.initialize();
    await assistant.demonstrateFileCapabilities();
    
    console.log('\n💡 Key Assistants API Features Demonstrated:');
    console.log('  ✅ Built-in code interpreter for data processing');
    console.log('  ✅ Automatic Python code generation and execution');
    console.log('  ✅ Data analysis and statistical insights');
    console.log('  ✅ Persistent context across complex analysis');
    console.log('  ✅ Business intelligence and recommendations');
    
    console.log('\n🔄 Compare with Agents SDK:');
    console.log('  • Agents: Custom tools, handoffs, workflow orchestration');
    console.log('  • Assistants: Built-in file tools, persistent state, code interpreter');
    
    await assistant.cleanup();
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    
    if (error.message.includes('quota') || error.message.includes('billing')) {
      console.log('\n💡 Note: This demo requires an active OpenAI account with available credits.');
    }
    
    await assistant.cleanup();
  }
}

runDataAnalysisDemo();
