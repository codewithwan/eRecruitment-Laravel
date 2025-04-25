<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class DebugController extends Controller
{
    public function debugDatabaseConnection()
    {
        try {
            // Test database connection
            $connection = DB::connection()->getPdo();
            echo "Database connected successfully: " . DB::connection()->getDatabaseName();
            
            // Check if tables exist
            $assessmentsExists = Schema::hasTable('assessments');
            $questionsExists = Schema::hasTable('questions');
            
            echo "<br>Tables exist: assessments=" . ($assessmentsExists ? 'yes' : 'no') . 
                 ", questions=" . ($questionsExists ? 'yes' : 'no');
            
            // Check table structures
            if ($assessmentsExists) {
                echo "<br><br>Assessments columns:<br>";
                $columns = Schema::getColumnListing('assessments');
                echo implode(', ', $columns);
            }
            
            if ($questionsExists) {
                echo "<br><br>Questions columns:<br>";
                $columns = Schema::getColumnListing('questions');
                echo implode(', ', $columns);
            }
            
            // Show data counts
            $assessmentCount = Assessment::count();
            $questionCount = Question::count();
            
            echo "<br><br>Record counts: assessments=" . $assessmentCount . 
                 ", questions=" . $questionCount;
                 
            // Show latest records
            if ($assessmentCount > 0) {
                echo "<br><br>Latest assessment:<br>";
                $latest = Assessment::latest()->first();
                echo "<pre>" . json_encode($latest, JSON_PRETTY_PRINT) . "</pre>";
            }
            
            // Check database driver and config
            echo "<br><br>Database driver: " . config('database.default');
            
            return "Debug complete";
        } catch (\Exception $e) {
            return "Database error: " . $e->getMessage();
        }
    }
    
    public function testSaveAssessment()
    {
        try {
            // Start a database transaction
            DB::beginTransaction();
            
            // Create a test assessment directly
            $assessment = new Assessment();
            $assessment->title = "Test Assessment " . time();
            $assessment->description = "This is a test assessment created directly";
            $assessment->test_type = "Logic";
            $assessment->duration = "10 Minutes";
            
            // Save and check result
            $assessmentSaved = $assessment->save();
            Log::info('Assessment save result:', ['success' => $assessmentSaved, 'id' => $assessment->id]);
            
            if (!$assessmentSaved || !$assessment->id) {
                throw new \Exception('Failed to save assessment record');
            }
            
            // Create a test question
            $question = new Question();
            $question->assessment_id = $assessment->id;
            $question->question_text = "Test question";
            // Properly encode array as JSON for database storage
            $question->options = json_encode(["Option 1", "Option 2"]);
            
            // Save and check result
            $questionSaved = $question->save();
            Log::info('Question save result:', ['success' => $questionSaved, 'id' => $question->id]);
            
            if (!$questionSaved || !$question->id) {
                throw new \Exception('Failed to save question record');
            }
            
            // Commit the transaction
            DB::commit();
            
            // Verify data was actually saved by retrieving it
            $verifyAssessment = Assessment::find($assessment->id);
            $verifyQuestion = Question::find($question->id);
            
            if (!$verifyAssessment || !$verifyQuestion) {
                return "Error: Data appeared to save but couldn't be retrieved. Check database consistency.";
            }
            
            return "Test assessment created successfully:<br>" .
                   "Assessment ID: " . $assessment->id . "<br>" .
                   "Question ID: " . $question->id . "<br>" .
                   "Verified: Yes";
                   
        } catch (\Exception $e) {
            // Roll back the transaction in case of error
            DB::rollBack();
            
            Log::error('Error creating test data: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return "Error creating test: " . $e->getMessage() . 
                   "<br>Check the Laravel log for more details.";
        }
    }
}
