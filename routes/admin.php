    <?php

    use App\Enums\UserRole;
    use App\Http\Controllers\AssessmentController;
    use App\Http\Controllers\QuestionController;
    use App\Http\Controllers\UserController;
    use App\Http\Controllers\VacanciesController;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Route;
    use Inertia\Inertia;

    // Admin route
    Route::middleware(['auth', 'verified', 'role:' . UserRole::HR->value])
        ->prefix('dashboard')
        ->name('admin.')
        ->group(function () {

            Route::get('/', [UserController::class, 'index'])->name('dashboard');

            Route::prefix('users')
                ->name('users.')
                ->group(function () {
                    Route::get('/', [UserController::class, 'store'])->name('info');
                    Route::post('/', [UserController::class, 'create'])->name('create');
                    Route::get('/list', [UserController::class, 'getUsers'])->name('users.list');
                    Route::put('/{user}', [UserController::class, 'update'])->name('update');
                    Route::delete('/{user}', [UserController::class, 'destroy'])->name('remove');
                });

            Route::prefix('jobs')
                ->name('jobs.')
                ->group(function () {
                    Route::get('/', [VacanciesController::class, 'store'])->name('info');
                    Route::post('/', [VacanciesController::class, 'create'])->name('create');
                    Route::put('/{job}', [VacanciesController::class, 'update'])->name('update');
                    Route::delete('/{job}', [VacanciesController::class, 'destroy'])->name('delete');
                });

            Route::prefix('candidates')
                ->name('candidates.')
                ->group(function () {
                    Route::get('/', [UserController::class, 'store'])->name('info');
                    Route::post('/', [UserController::class, 'create'])->name('create');
                    Route::put('/{candidate}', [UserController::class, 'update'])->name('update');
                    Route::delete('/{candidate}', [UserController::class, 'destroy'])->name('remove');

                    Route::prefix('questions')
                        ->name('questions.')
                        ->group(function () {
                            Route::get('/', [QuestionController::class, 'store'])->name('info');
                        });
                });

            // === QUESTION SET ===
            Route::prefix('questions')
                ->name('questions.')
                ->group(function () {
                    // Daftar soal
                    Route::get('/question-set', [QuestionController::class, 'Index'])->name('question-set.index');

                    // Tambah soal
                    Route::get('/questions-set/add-questions', [QuestionController::class, 'create'])->name('question-set.create');
                    Route::post('/question-set/store', [QuestionController::class, 'store'])->name('question-set.store');

                    // Edit soal
                    Route::get('/questions-set/edit-questions/{id}', [QuestionController::class, 'edit'])->name('question-set.edit');
                    Route::put('/question-set/{id}', [QuestionController::class, 'update'])->name('question-set.update');

                    // Hapus soal
                    Route::delete('/question-set/{id}', [QuestionController::class, 'destroy'])->name('question-set.destroy');

                    // === QUESTION PACKS ===
                    Route::prefix('question-packs')
                        ->name('packs.')
                        ->group(function () {
                            // Daftar question packs
                            Route::get('/', [QuestionController::class, 'indexPack'])->name('index');

                            // Tambah question pack
                            Route::get('/add', [QuestionController::class, 'createPack'])->name('create');
                            Route::post('/store', [QuestionController::class, 'storePack'])->name('store');

                            // Pilih soal untuk question pack
                            Route::get('/select-questions', [QuestionController::class, 'selectQuestions'])->name('select-questions');
                            Route::post('/save-selected', [QuestionController::class, 'saveSelected'])->name('saveSelected');
                            Route::post('/temp-store', [QuestionController::class, 'tempStore'])->name('tempStore');

                            // Edit question pack
                            Route::get('/{id}/edit', [QuestionController::class, 'editPack'])->name('edit');
                            Route::put('/{id}', [QuestionController::class, 'updatePack'])->name('update');

                            // Hapus question pack
                            Route::delete('/{id}', [QuestionController::class, 'destroyPack'])->name('destroy');
                        });
                });
        });


            // Route::post('/debug-update/{assessment}', function(Request $request, Assessment $assessment) {
                    //     Log::info('Debug update received for assessment: ' . $assessment->id, [
                    //         'request' => $request->all()
                    //     ]);
                    //     return response()->json([
                    //         'status' => 'received',
                    //         'assessment_id' => $assessment->id,
                    //         'data' => $request->all()
                    //     ]);
                    // })->name('debug.update');
